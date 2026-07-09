from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from app.database.base import Base


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String(255), nullable=False)
    dataset_type = Column(String(100), nullable=False, default="Unknown")
    row_count = Column(Integer, nullable=False, default=0)
    status = Column(String(50), nullable=False, default="COMPLETED")
    validation_score = Column(Integer, nullable=False, default=100)
    storage_path = Column(Text, nullable=False)
    uploaded_by = Column(String(100), nullable=False, default="local_user")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class DatasetProfile(Base):
    __tablename__ = "dataset_profiles"

    id = Column(Integer, primary_key=True, index=True)
    upload_id = Column(Integer, nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    row_count = Column(Integer, nullable=False, default=0)
    column_count = Column(Integer, nullable=False, default=0)
    duplicate_rows = Column(Integer, nullable=False, default=0)
    null_percentage = Column(Float, nullable=False, default=0.0)
    quality_score = Column(Integer, nullable=False, default=100)
    schema_json = Column(Text, nullable=False)
    statistics_json = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
