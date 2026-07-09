from __future__ import annotations

import json

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.upload import DatasetProfileOut, UploadOut
from app.services.upload_service import create_upload, get_profile, list_uploads

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.get("", response_model=list[UploadOut])
def get_uploads(db: Session = Depends(get_db)):
    return list_uploads(db)


@router.post("", response_model=UploadOut)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported in this release.")
    return await create_upload(db, file)


@router.get("/{upload_id}/profile", response_model=DatasetProfileOut)
def get_upload_profile(upload_id: int, db: Session = Depends(get_db)):
    profile = get_profile(db, upload_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found for upload.")
    return DatasetProfileOut(
        id=profile.id,
        upload_id=profile.upload_id,
        file_name=profile.file_name,
        row_count=profile.row_count,
        column_count=profile.column_count,
        duplicate_rows=profile.duplicate_rows,
        null_percentage=profile.null_percentage,
        quality_score=profile.quality_score,
        schema=json.loads(profile.schema_json),
        statistics=json.loads(profile.statistics_json),
        created_at=profile.created_at,
    )
