from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.uploads import router as uploads_router
from app.database.base import Base
from app.database.session import engine
from app.models import upload  # noqa: F401 - register SQLAlchemy models

app = FastAPI(
    title="SentinelIQ API",
    description="AI-native trade surveillance platform",
    version="0.3.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def initialise_database():
    Base.metadata.create_all(bind=engine)


app.include_router(health_router, prefix="/api")
app.include_router(uploads_router, prefix="/api")
