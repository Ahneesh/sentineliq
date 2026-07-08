from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.ingestion import DatasetType
from app.schemas.ingestion import ConnectorRead, DatasetRead, UploadDetail, UploadRead
from app.services.ingestion_service import IngestionService

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("", response_model=UploadDetail)
async def create_upload(
    file: UploadFile = File(...),
    dataset_type: DatasetType = Form(DatasetType.ORDERS),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported in v0.3.1")
    service = IngestionService(db)
    return await service.create_upload(file=file, dataset_type=dataset_type)


@router.get("", response_model=list[UploadRead])
def list_uploads(db: Session = Depends(get_db)):
    return IngestionService(db).list_uploads()


@router.get("/catalog/datasets", response_model=list[DatasetRead])
def list_datasets(db: Session = Depends(get_db)):
    return IngestionService(db).list_datasets()


@router.get("/connectors/list", response_model=list[ConnectorRead])
def list_connectors(db: Session = Depends(get_db)):
    return IngestionService(db).list_connectors()


@router.get("/{upload_id}", response_model=UploadDetail)
def get_upload(upload_id: int, db: Session = Depends(get_db)):
    upload = IngestionService(db).get_upload(upload_id)
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    return upload
