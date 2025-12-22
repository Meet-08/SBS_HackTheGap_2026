from pydantic import BaseModel, Field
from typing import Optional, Dict
from enum import Enum


class SeasonEnum(str, Enum):
    """Valid season values."""

    KHARIF = "Kharif"
    RABI = "Rabi"
    WHOLE_YEAR = "Whole Year"


class WeatherData(BaseModel):
    """Weather data from NASA POWER API."""

    avg_temp: Optional[float] = Field(None, description="Average temperature (°C)")
    humidity_avg: Optional[float] = Field(None, description="Average humidity (%)")
    rain_total: Optional[float] = Field(None, description="Total rainfall (mm)")
    solar_avg: Optional[float] = Field(
        None, description="Average solar radiation (MJ/m²/day)"
    )


class SoilData(BaseModel):
    """Soil data from SoilGrids API."""

    soil_ph: Optional[float] = Field(None, description="Soil pH")
    soil_oc: Optional[float] = Field(None, description="Soil organic carbon")
    clay_pct: Optional[float] = Field(None, description="Clay percentage")
    sand_pct: Optional[float] = Field(None, description="Sand percentage")
    cec_cmol: Optional[float] = Field(
        None, description="Cation exchange capacity (cmol/kg)"
    )


class PredictionRequest(BaseModel):
    """Request schema for yield prediction."""

    state: str
    district: str
    latitude: float = Field(
         description="Latitude", ge=-90, le=90
    )
    longitude: float = Field(
         description="Longitude", ge=-180, le=180
    )
    season: SeasonEnum = Field(..., description="Cropping season")
    year: int
    crop: str
    area_ha: float


class PredictionResponse(BaseModel):
    """Response schema for yield prediction."""

    predicted_yield_qha: float = Field(
        ..., description="Predicted yield in quintals per hectare"
    )
    weather: WeatherData
    soil: SoilData
    model_used: str = Field(..., description="ML model used for prediction")
    last_four_years_yield: Dict[int, Optional[float]] = Field(
        default_factory=dict,
        description="Yield data for the last 4 years from start year (year -> yield in quintals/hectare)"
    )
