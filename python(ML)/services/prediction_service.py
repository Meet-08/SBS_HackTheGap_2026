import asyncio
import pandas as pd
from pathlib import Path
from schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)
from services.data_service import data_service
from services.model_service import model_service


class PredictionService:
    """Orchestrator service for the complete prediction workflow."""

    def __init__(self):
        """Initialize with historical crop data."""
        self._crop_data = None

    def _load_crop_data(self) -> pd.DataFrame:
        """Load and cache the processed crop data."""
        if self._crop_data is None:
            csv_path = Path(__file__).parent.parent / "data" / "processed_crop_data.csv"
            self._crop_data = pd.read_csv(csv_path)
        return self._crop_data

    async def _get_historical_yields(
        self,
        state: str,
        district: str,
        season: str,
        crop: str,
        year: int,
        latitude: float,
        longitude: float,
        area_ha: float,
        soil_data,
    ) -> dict:
        """
        Get yield data for the last 4 years from the CSV data.
        If data is not available in CSV, predict using the model.

        Args:
            state: State name
            district: District name
            season: Season (Kharif, Rabi, Whole Year)
            crop: Crop name
            year: Start year to look back from
            latitude: Location latitude for prediction
            longitude: Location longitude for prediction
            area_ha: Area in hectares for prediction
            soil_data: Soil data for prediction

        Returns:
            Dictionary mapping year to yield value
        """
        df = self._load_crop_data()
        historical_yields = {}

        # Normalize inputs for matching
        state_norm = state.lower().strip()
        district_norm = district.lower().strip()

        # Get model name for this crop
        model_name = model_service.get_model_for_crop(crop)

        for offset in range(1, 5):
            past_year = year - offset
            # Filter by normalized state, district, season, crop, and year
            mask = (
                (df["State_norm"] == state_norm) &
                (df["District_norm"] == district_norm) &
                (df["Season"] == season) &
                (df["Crop"].str.lower() == crop.lower()) &
                (df["Start_Year"] == past_year)
            )
            filtered = df[mask]

            if not filtered.empty:
                # Use CSV data if available
                historical_yields[past_year] = round(filtered["Yield_QHa"].iloc[0], 2)
            else:
                # Predict using the model if CSV data not available
                try:
                    weather_data = await data_service.get_weather_data(
                        latitude=latitude,
                        longitude=longitude,
                        year=past_year,
                        season=season,
                    )
                    predicted_yield = model_service.predict(
                        model_name=model_name,
                        latitude=latitude,
                        longitude=longitude,
                        area_ha=area_ha,
                        season=season,
                        year=past_year,
                        crop=crop,
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
                    historical_yields[past_year] = round(predicted_yield, 2)
                except Exception:
                    historical_yields[past_year] = None

        return historical_yields

    async def predict(self, request: PredictionRequest) -> PredictionResponse:
        """
        Execute the full prediction workflow.

        Steps:
        1. Resolve location coordinates
        2. Fetch weather data
        3. Fetch soil data
        4. Select appropriate model based on crop
        5. Make prediction
        6. Calculate last 4 years yield
        7. Return complete response

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

        # Get last 4 years yield from CSV data or predict if not available
        last_four_years_yield = await self._get_historical_yields(
            state=request.state,
            district=request.district,
            season=request.season.value,
            crop=request.crop,
            year=request.year,
            latitude=latitude,
            longitude=longitude,
            area_ha=request.area_ha,
            soil_data=soil_data,
        )

        # Step 7: Build response
        return PredictionResponse(
            predicted_yield_qha=round(predicted_yield, 2),
            weather=weather_data,
            soil=soil_data,
            model_used=model_name,
            last_four_years_yield=last_four_years_yield,
        )


# Singleton instance
prediction_service = PredictionService()

