from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.upload_service import create_upload, get_profile, list_uploads

router = APIRouter(prefix="/uploads", tags=["uploads"])


def upload_to_dict(upload):
    return {
        "id": upload.id,
        "upload_id": upload.id,
        "file_name": upload.file_name,
        "dataset_type": upload.dataset_type,
        "row_count": upload.row_count,
        "status": upload.status,
        "validation_score": upload.validation_score,
        "storage_path": upload.storage_path,
        "uploaded_by": upload.uploaded_by,
        "created_at": upload.created_at,
    }


@router.get("")
def get_uploads(db: Session = Depends(get_db)):
    return [upload_to_dict(upload) for upload in list_uploads(db)]


@router.post("")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    upload = await create_upload(db, file)
    return upload_to_dict(upload)


@router.get("/{upload_id}/profile")
def get_upload_profile(upload_id: int, db: Session = Depends(get_db)):
    profile = get_profile(db, upload_id)

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "id": profile.id,
        "upload_id": profile.upload_id,
        "row_count": profile.row_count,
        "column_count": profile.column_count,
        "duplicate_rows": profile.duplicate_rows,
        "null_percentage": profile.null_percentage,
        "schema": profile.profile_schema,
        "statistics": profile.statistics,
        "created_at": profile.created_at,
    }
