from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.upload import UploadRead, UploadSummary
from app.services.upload_service import create_upload, list_uploads

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.get("", response_model=list[UploadRead])
def get_uploads(db: Session = Depends(get_db)):
    return list_uploads(db)


@router.post("", response_model=UploadSummary)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    upload = await create_upload(db, file)
    return {
        "upload": upload,
        "message": "Upload processed successfully",
    }
