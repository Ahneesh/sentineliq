from __future__ import annotations

import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.upload import DatasetProfile, Upload
from app.services.profiling_service import profile_csv

UPLOAD_DIR = Path("storage/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _safe_file_name(file_name: str) -> str:
    return file_name.replace("/", "_").replace(" ", "_")


async def create_upload(db: Session, file: UploadFile) -> Upload:
    safe_name = _safe_file_name(file.filename or "upload.csv")
    storage_path = UPLOAD_DIR / f"{uuid4().hex}_{safe_name}"

    with storage_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    profile = profile_csv(storage_path, safe_name)

    upload = Upload(
        file_name=safe_name,
        dataset_type=profile["dataset_type"],
        row_count=profile["row_count"],
        status="COMPLETED",
        validation_score=profile["quality_score"],
        storage_path=str(storage_path),
        uploaded_by="local_user",
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)

    dataset_profile = DatasetProfile(
        upload_id=upload.id,
        row_count=profile["row_count"],
        column_count=profile["column_count"],
        duplicate_rows=profile["duplicate_rows"],
        null_percentage=profile["null_percentage"],
        profile_schema=profile["schema"],
        statistics=profile["statistics"],
    )
    db.add(dataset_profile)
    db.commit()

    return upload


def list_uploads(db: Session) -> list[Upload]:
    return db.query(Upload).order_by(Upload.created_at.desc()).all()


def get_profile(db: Session, upload_id: int) -> DatasetProfile | None:
    return (
        db.query(DatasetProfile)
        .filter(DatasetProfile.upload_id == upload_id)
        .order_by(DatasetProfile.created_at.desc())
        .first()
    )
