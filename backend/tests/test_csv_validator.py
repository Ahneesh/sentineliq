from pathlib import Path

from app.ingestion.csv_validator import validate_csv


def test_orders_csv_validation_success(tmp_path: Path):
    csv_file = tmp_path / "orders.csv"
    csv_file.write_text(
        "order_id,trader_id,instrument,side,quantity,price,timestamp\n"
        "O-1,T-1,AAPL,BUY,100,180.2,2026-07-08T09:30:00Z\n",
        encoding="utf-8",
    )

    result = validate_csv(csv_file, "ORDERS")

    assert result.row_count == 1
    assert result.column_count == 7
    assert result.error_count == 0


def test_orders_csv_validation_missing_required_column(tmp_path: Path):
    csv_file = tmp_path / "orders.csv"
    csv_file.write_text("order_id,trader_id,instrument\nO-1,T-1,AAPL\n", encoding="utf-8")

    result = validate_csv(csv_file, "ORDERS")

    assert result.error_count > 0
    assert any(issue.code == "MISSING_REQUIRED_COLUMN" for issue in result.issues)
