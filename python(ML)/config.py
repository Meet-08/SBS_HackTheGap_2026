from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings."""

    APP_TITLE: str = "Crop Yield Prediction API"

    # Paths
    BASE_DIR: Path = Path(__file__).parent
    MODELS_DIR: Path = BASE_DIR / "models"

    # Model mapping
    MODEL_FILES: dict = {
        "Model_1_UltraLow": "model_Model_1_UltraLow.joblib",
        "Model_2_Low": "model_Model_2_Low.joblib",
        "Model_3_Medium": "model_Model_3_Medium.joblib",
        "Model_4_HighVeg": "model_Model_4_HighVeg.joblib",
        "Model_5_UltraHigh": "model_Model_5_UltraHigh.joblib",
        "Model_6_Coconut": "model_Model_6_Coconut.joblib",
    }

    # Redis Configuration
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0

    # Cache TTL (Time To Live) in seconds
    SOIL_CACHE_TTL: int = 2592000  # 30 days - soil data changes rarely
    WEATHER_CACHE_TTL: int = 86400  # 24 hours - for current year weather
    HISTORICAL_WEATHER_CACHE_TTL: int = 604800  # 7 days - historical weather

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
