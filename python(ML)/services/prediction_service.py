import asyncio
from schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)
from services.data_service import data_service
from services.model_service import model_service


class PredictionService:
    """Orchestrator service for the complete prediction workflow."""

    async def predict(self, request: PredictionRequest) -> PredictionResponse:
        """
        Execute the full prediction workflow.

        Steps:
        1. Resolve location coordinates
        2. Fetch weather data
        3. Fetch soil data
        4. Select appropriate model based on crop
        5. Make prediction
        6. Return complete response

        Args:
            request: Prediction request with location, season, crop, etc.

        Returns:
            Complete prediction response with yield, weather, soil data
        """
        latitude, longitude = request.latitude, request.longitude

        weather_task = data_service.get_weather_data(
            latitude=latitude,
            longitude=longitude,
            year=request.year,
            season=request.season.value,
        )
        soil_task = data_service.get_soil_data(
            latitude=latitude,
            longitude=longitude,
        )

        weather_data, soil_data = await asyncio.gather(weather_task, soil_task)

        model_name = model_service.get_model_for_crop(request.crop)

        predicted_yield = model_service.predict(
            model_name=model_name,
            latitude=latitude,
            longitude=longitude,
            area_ha=request.area_ha,
            season=request.season.value,
            year=request.year,
            crop=request.crop,
            soil_ph=soil_data.soil_ph,
            soil_oc=soil_data.soil_oc,
            clay_pct=soil_data.clay_pct,
            sand_pct=soil_data.sand_pct,
            cec_cmol=soil_data.cec_cmol,
            avg_temp=weather_data.avg_temp,
            humidity_avg=weather_data.humidity_avg,
            rain_total=weather_data.rain_total,
            solar_avg=weather_data.solar_avg,
        )

        # Step 6: Build response
        return PredictionResponse(
            predicted_yield_qha=round(predicted_yield, 2),
            weather=weather_data,
            soil=soil_data,
            model_used=model_name,
        )


# Singleton instance
prediction_service = PredictionService()
