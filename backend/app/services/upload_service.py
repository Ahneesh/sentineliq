import csv
import os
import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.upload import Upload


REQUIRED_ORDER_COLUMNS = {"order_id", "trader_id", "instrument", "side", "quantity", "price", "timestamp"}


def infer_dataset_type(file_name: str) -> str:
    lower = file_name.lower()
    if "order" in lower:
        return "Orders"
    if "trade" in lower:
        return "Trades"
    if "market" in lower or "price" in lower:
        return "Market Data"
    return "Unknown"


def count_csv_rows(path: Path) -> tuple[int, int]:
    """Return row count and simple validation score."""
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        row_count = len(rows)
        fieldnames = set(reader.fieldnames or [])

    if row_count == 0:
        return 0, 0

    if REQUIRED_ORDER_COLUMNS.intersection(fieldnames):
        missing = REQUIRED_ORDER_COLUMNS - fieldnames
        score = max(0, 100 - (len(missing) * 12))
    else:
        score = 85

    return row_count, score


async def create_upload(db: Session, file: UploadFile) -> Upload:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_name = os.path.basename(file.filename or "upload.csv")
    stored_name = f"{uuid4().hex}_{safe_name}"
    storage_path = upload_dir / stored_name

    with storage_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    row_count, validation_score = count_csv_rows(storage_path)

    upload = Upload(
        file_name=safe_name,
        dataset_type=infer_dataset_type(safe_name),
        row_count=row_count,
        status="COMPLETED",
        validation_score=validation_score,
        storage_path=str(storage_path),
        uploaded_by="local_user",
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)
    return upload


def list_uploads(db: Session) -> list[Upload]:
    return db.query(Upload).order_by(Upload.created_at.desc()).all()
