from pathlib import Path

from app.models.upload import Upload
from app.services.dataset_explorer_service import get_dataset_preview


class _Query:
    def __init__(self, upload):
        self.upload = upload

    def filter(self, *_args, **_kwargs):
        return self

    def first(self):
        return self.upload


class _Session:
    def __init__(self, upload):
        self.upload = upload

    def query(self, _model):
        return _Query(self.upload)


def test_dataset_preview_search_sort_and_pagination(tmp_path: Path):
    csv_file = tmp_path / "orders.csv"
    csv_file.write_text(
        "order_id,trader_id,instrument,quantity\n"
        "O-1,T-2,MSFT,200\n"
        "O-2,T-1,AAPL,100\n"
        "O-3,T-3,AAPL,300\n",
        encoding="utf-8",
    )
    upload = Upload(
        id=7,
        file_name="orders.csv",
        dataset_type="Orders",
        row_count=3,
        status="COMPLETED",
        validation_score=100,
        storage_path=str(csv_file),
        uploaded_by="tester",
    )

    result = get_dataset_preview(
        _Session(upload),
        7,
        page=1,
        page_size=1,
        search="AAPL",
        sort_by="quantity",
        sort_direction="desc",
    )

    assert result["total_rows"] == 2
    assert result["total_pages"] == 2
    assert result["rows"][0]["order_id"] == "O-3"
    assert result["columns"] == ["order_id", "trader_id", "instrument", "quantity"]
