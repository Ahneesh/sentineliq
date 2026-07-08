from datetime import datetime
from pydantic import BaseModel


class UploadRead(BaseModel):
    id: int
    file_name: str
    dataset_type: str
    row_count: int
    status: str
    validation_score: int
    uploaded_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class UploadSummary(BaseModel):
    upload: UploadRead
    message: str
