from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path


REQUIRED_COLUMNS_BY_DATASET: dict[str, set[str]] = {
    "ORDERS": {"order_id", "trader_id", "instrument", "side", "quantity", "price", "timestamp"},
    "TRADES": {"trade_id", "order_id", "trader_id", "instrument", "quantity", "price", "timestamp"},
    "MARKET_DATA": {"instrument", "timestamp", "price", "volume"},
    "REFERENCE_DATA": {"instrument", "asset_class"},
}


@dataclass(frozen=True)
class ValidationIssue:
    severity: str
    code: str
    message: str
    row_number: int | None = None


@dataclass(frozen=True)
class ValidationResult:
    row_count: int
    column_count: int
    issues: list[ValidationIssue]

    @property
    def error_count(self) -> int:
        return sum(1 for issue in self.issues if issue.severity == "ERROR")

    @property
    def warning_count(self) -> int:
        return sum(1 for issue in self.issues if issue.severity == "WARNING")


def validate_csv(path: Path, dataset_type: str) -> ValidationResult:
    issues: list[ValidationIssue] = []
    row_count = 0
    column_count = 0

    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        headers = reader.fieldnames or []
        normalised_headers = {header.strip().lower() for header in headers}
        column_count = len(headers)

        required = REQUIRED_COLUMNS_BY_DATASET.get(dataset_type.upper(), set())
        missing = sorted(required - normalised_headers)
        for column in missing:
            issues.append(
                ValidationIssue(
                    severity="ERROR",
                    code="MISSING_REQUIRED_COLUMN",
                    message=f"Missing required column: {column}",
                )
            )

        seen_ids: set[str] = set()
        primary_key = "order_id" if dataset_type.upper() == "ORDERS" else "trade_id" if dataset_type.upper() == "TRADES" else None

        for index, row in enumerate(reader, start=2):
            row_count += 1
            if primary_key:
                identifier = (row.get(primary_key) or row.get(primary_key.upper()) or "").strip()
                if identifier:
                    if identifier in seen_ids:
                        issues.append(
                            ValidationIssue(
                                severity="WARNING",
                                code="DUPLICATE_IDENTIFIER",
                                message=f"Duplicate {primary_key}: {identifier}",
                                row_number=index,
                            )
                        )
                    seen_ids.add(identifier)
            if row_count >= 100_000:
                issues.append(
                    ValidationIssue(
                        severity="WARNING",
                        code="VALIDATION_SAMPLE_LIMIT",
                        message="Validation sampled the first 100,000 rows for local development performance.",
                    )
                )
                break

    if row_count == 0:
        issues.append(
            ValidationIssue(
                severity="ERROR",
                code="EMPTY_FILE",
                message="The uploaded CSV contains no data rows.",
            )
        )

    return ValidationResult(row_count=row_count, column_count=column_count, issues=issues)
