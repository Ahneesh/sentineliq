from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.dataset_explorer_service import get_dataset_preview
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
        "file_name": profile.upload.file_name,
        "row_count": profile.row_count,
        "column_count": profile.column_count,
        "duplicate_rows": profile.duplicate_rows,
        "null_percentage": profile.null_percentage,
        "quality_score": profile.upload.validation_score,
        "schema": profile.profile_schema,
        "statistics": profile.statistics,
        "created_at": profile.created_at,
    }


@router.get("/{upload_id}/preview")
def preview_upload_dataset(
    upload_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=200),
    search: str | None = Query(default=None, max_length=250),
    sort_by: str | None = Query(default=None, max_length=250),
    sort_direction: str = Query(default="asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    return get_dataset_preview(
        db,
        upload_id,
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_direction=sort_direction,
    )
