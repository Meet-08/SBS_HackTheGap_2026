from fastapi import FastAPI
from contextlib import asynccontextmanager

from config import settings
from routes.predict import router
from services.model_service import model_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: Load ML models
    print("Loading ML models...")
    model_service.load_models()
    print("Models loaded successfully!")
    yield

    print("Shutting down...")


app = FastAPI(
    title=settings.APP_TITLE,
    lifespan=lifespan,
)

app.include_router(router)

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_TITLE,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    # Trigger CI
