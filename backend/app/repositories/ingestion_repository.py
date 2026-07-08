from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.ingestion import Dataset, DatasetType, Upload, UploadError


class IngestionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_dataset(self, name: str, dataset_type: DatasetType) -> Dataset:
        dataset = self.db.scalar(select(Dataset).where(Dataset.name == name))
        if dataset:
            return dataset
        dataset = Dataset(name=name, dataset_type=dataset_type, description=f"{dataset_type.value.title()} dataset")
        self.db.add(dataset)
        self.db.flush()
        return dataset

    def create_upload(self, upload: Upload) -> Upload:
        self.db.add(upload)
        self.db.flush()
        return upload

    def add_error(self, upload_id: int, severity: str, code: str, message: str, row_number: int | None = None) -> None:
        self.db.add(
            UploadError(
                upload_id=upload_id,
                severity=severity,
                code=code,
                message=message,
                row_number=row_number,
            )
        )

    def list_uploads(self, limit: int = 50) -> list[Upload]:
        return list(
            self.db.scalars(
                select(Upload)
                .options(selectinload(Upload.dataset))
                .order_by(Upload.created_at.desc())
                .limit(limit)
            )
        )

    def get_upload(self, upload_id: int) -> Upload | None:
        return self.db.scalar(
            select(Upload)
            .options(selectinload(Upload.errors), selectinload(Upload.dataset))
            .where(Upload.id == upload_id)
        )

    def list_datasets(self) -> list[Dataset]:
        return list(self.db.scalars(select(Dataset).order_by(Dataset.name.asc())))
