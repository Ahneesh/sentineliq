from datetime import datetime
from typing import Any

from pydantic import BaseModel


class UploadOut(BaseModel):
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


class DatasetProfileOut(BaseModel):
    id: int
    upload_id: int
    file_name: str
    row_count: int
    column_count: int
    duplicate_rows: int
    null_percentage: float
    quality_score: int
    schema: list[dict[str, Any]]
    statistics: dict[str, Any]
    created_at: datetime
