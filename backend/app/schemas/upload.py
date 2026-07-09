from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class DatasetProfileOut(BaseModel):
    id: int
    upload_id: int
    row_count: int
    column_count: int
    duplicate_rows: int
    null_percentage: float
    profile_schema: list[dict[str, Any]]
    statistics: dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UploadOut(BaseModel):
    id: int
    file_name: str
    dataset_type: str
    row_count: int
    status: str
    validation_score: int
    storage_path: str | None
    uploaded_by: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
