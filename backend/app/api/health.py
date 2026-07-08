from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "SentinelIQ",
        "version": "0.1.0"
    }
