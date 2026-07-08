from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UploadErrorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    severity: str
    code: str
    message: str
    row_number: int | None = None
    created_at: datetime


class DatasetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    dataset_type: str
    description: str | None = None
    created_at: datetime


class UploadRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dataset_id: int | None = None
    original_filename: str
    status: str
    row_count: int
    column_count: int
    error_count: int
    warning_count: int
    uploaded_by: str
    created_at: datetime
    completed_at: datetime | None = None


class UploadDetail(UploadRead):
    errors: list[UploadErrorRead] = []
    dataset: DatasetRead | None = None


class ConnectorRead(BaseModel):
    id: str
    name: str
    description: str
    status: str
    icon: str
