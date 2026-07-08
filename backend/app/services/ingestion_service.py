from __future__ import annotations

from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.ingestion.csv_validator import validate_csv
from app.models.ingestion import DatasetType, Upload, UploadStatus
from app.repositories.ingestion_repository import IngestionRepository

UPLOAD_ROOT = Path("data/uploads")


class IngestionService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = IngestionRepository(db)

    async def create_upload(self, file: UploadFile, dataset_type: DatasetType, uploaded_by: str = "local.dev") -> Upload:
        UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
        safe_name = file.filename or "upload.csv"
        stored_path = UPLOAD_ROOT / f"{uuid4()}-{safe_name}"
        content = await file.read()
        stored_path.write_bytes(content)

        dataset = self.repository.get_or_create_dataset(dataset_type.value.title().replace("_", " "), dataset_type)
        upload = self.repository.create_upload(
            Upload(
                dataset_id=dataset.id,
                original_filename=safe_name,
                stored_path=str(stored_path),
                status=UploadStatus.VALIDATING,
                uploaded_by=uploaded_by,
            )
        )
        self.db.commit()
        self.db.refresh(upload)

        result = validate_csv(stored_path, dataset_type.value)
        upload.row_count = result.row_count
        upload.column_count = result.column_count
        upload.error_count = result.error_count
        upload.warning_count = result.warning_count
        upload.status = UploadStatus.FAILED if result.error_count else UploadStatus.COMPLETED
        upload.completed_at = datetime.utcnow()

        for issue in result.issues[:250]:
            self.repository.add_error(
                upload_id=upload.id,
                severity=issue.severity,
                code=issue.code,
                message=issue.message,
                row_number=issue.row_number,
            )

        self.db.commit()
        self.db.refresh(upload)
        return upload

    def list_uploads(self) -> list[Upload]:
        return self.repository.list_uploads()

    def get_upload(self, upload_id: int) -> Upload | None:
        return self.repository.get_upload(upload_id)

    def list_datasets(self):
        return self.repository.list_datasets()

    def list_connectors(self):
        return [
            {"id": "csv", "name": "CSV Upload", "description": "Upload orders, trades, market data or reference data files.", "status": "AVAILABLE", "icon": "csv"},
            {"id": "fix", "name": "FIX", "description": "Connect OMS/EMS FIX order and execution flows.", "status": "COMING_SOON", "icon": "fix"},
            {"id": "kafka", "name": "Kafka", "description": "Stream market events and trade activity from Kafka topics.", "status": "COMING_SOON", "icon": "kafka"},
            {"id": "rest", "name": "REST API", "description": "Push trading events using authenticated REST APIs.", "status": "COMING_SOON", "icon": "api"},
            {"id": "s3", "name": "S3 / Object Store", "description": "Ingest batch files from cloud object storage.", "status": "COMING_SOON", "icon": "s3"},
            {"id": "database", "name": "Database", "description": "Connect directly to source trading databases.", "status": "COMING_SOON", "icon": "database"},
        ]
