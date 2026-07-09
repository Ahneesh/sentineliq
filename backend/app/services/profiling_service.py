from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import polars as pl


def _infer_dataset_type(file_name: str) -> str:
    lower = file_name.lower()
    if "order" in lower:
        return "Orders"
    if "trade" in lower:
        return "Trades"
    if "market" in lower or "price" in lower:
        return "Market Data"
    return "Unknown"


def _serialise(value: Any) -> Any:
    if value is None:
        return None
    if hasattr(value, "isoformat"):
        return value.isoformat()
    try:
        json.dumps(value)
        return value
    except TypeError:
        return str(value)


def profile_csv(file_path: str | Path, file_name: str) -> dict[str, Any]:
    """Profile a CSV file using Polars and return enterprise-friendly metadata."""
    path = Path(file_path)
    df = pl.read_csv(path, infer_schema_length=2000, ignore_errors=True)

    row_count = df.height
    column_count = len(df.columns)
    duplicate_rows = row_count - df.unique().height if row_count else 0

    total_cells = max(row_count * column_count, 1)
    null_cells = sum(df[col].null_count() for col in df.columns)
    null_percentage = round((null_cells / total_cells) * 100, 2)

    columns: list[dict[str, Any]] = []
    type_counts: dict[str, int] = {}

    for col in df.columns:
        series = df[col]
        dtype = str(series.dtype)
        type_counts[dtype] = type_counts.get(dtype, 0) + 1
        null_count = series.null_count()
        distinct_count = series.n_unique()
        completeness = 100.0 if row_count == 0 else round(((row_count - null_count) / row_count) * 100, 2)

        stats: dict[str, Any] = {}
        if dtype.lower().startswith(("int", "float", "decimal")):
            stats = {
                "min": _serialise(series.min()),
                "max": _serialise(series.max()),
                "mean": _serialise(round(float(series.mean()), 4)) if series.mean() is not None else None,
            }
        else:
            sample_values = [
                _serialise(v)
                for v in series.drop_nulls().head(3).to_list()
            ]
            stats = {"sample_values": sample_values}

        columns.append(
            {
                "name": col,
                "inferred_type": dtype,
                "null_count": int(null_count),
                "null_percentage": round((null_count / row_count) * 100, 2) if row_count else 0.0,
                "distinct_count": int(distinct_count),
                "completeness": completeness,
                "statistics": stats,
            }
        )

    quality_score = max(0, min(100, int(round(100 - null_percentage - min(duplicate_rows, 20)))))

    return {
        "dataset_type": _infer_dataset_type(file_name),
        "row_count": row_count,
        "column_count": column_count,
        "duplicate_rows": duplicate_rows,
        "null_percentage": null_percentage,
        "quality_score": quality_score,
        "schema": columns,
        "statistics": {
            "type_counts": type_counts,
            "file_size_bytes": path.stat().st_size,
        },
    }
