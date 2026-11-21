from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/")
async def health_check():
    return {
        "status": "healthy",
        "service": "Medinexa AI Backend",
        "version": "1.0.0",
        "demo_mode": settings.DEMO_MODE,
    }
