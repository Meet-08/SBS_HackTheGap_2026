from fastapi import APIRouter, HTTPException
from schemas.prediction import PredictionRequest, PredictionResponse
from services.prediction_service import prediction_service

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict_yield(request: PredictionRequest):
    """
    Predict crop yield based on location, season, and crop type.

    This endpoint:
    1. Resolves location coordinates (from centroid data if not provided)
    2. Fetches weather data from NASA POWER API
    3. Fetches soil data from SoilGrids API
    4. Uses the appropriate ML model to predict yield
    5. Returns prediction with all environmental data

    **Note**: Weather and soil data fetching may take a few seconds due to external API calls.
    """
    try:
        response = await prediction_service.predict(request)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@router.get("/crops", tags=["Reference"])
async def list_supported_crops():
    """List all supported crops with their associated models."""
    from services.model_service import model_service

    return {
        "crops": model_service.CROP_MODEL_MAPPING,
        "default_model": "Model_3_Medium",
    }


@router.get("/seasons", tags=["Reference"])
async def list_seasons():
    """List valid season values."""
    from schemas import SeasonEnum

    return {
        "seasons": [season.value for season in SeasonEnum]
    }
