from fastapi import APIRouter
from sqlalchemy import text

from app.database.session import engine

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "healthy", "application": "SentinelIQ", "version": "0.3.2"}


@router.get("/health/db")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "healthy", "database": "postgresql"}
