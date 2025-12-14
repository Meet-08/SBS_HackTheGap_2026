import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, Tuple
from pathlib import Path
from config import settings


class ModelService:
    """Service for loading and using ML models."""

    _instance = None
    _models: Dict[str, Tuple[Any, Any]] = {}  # (model, preprocessor) tuples

    # Crop to model mapping based on yield ranges
    # UltraLow: Sesamum, Moth (yield < 10)
    # Low: Pulses, oilseeds (yield 5-20)
    # Medium: Cereals, cotton, most crops (yield 10-60)
    # HighVeg: Vegetables like potato, onion, garlic (yield 100-400)
    # UltraHigh: Sugarcane, banana (yield 600-900)
    # Coconut: Coconut specific

    CROP_MODEL_MAPPING = {
        # UltraLow crops
        "sesamum": "Model_1_UltraLow",
        "moth": "Model_1_UltraLow",
        # Low yield crops
        "arhar/tur": "Model_2_Low",
        "gram": "Model_2_Low",
        "urad": "Model_2_Low",
        "moong(green gram)": "Model_2_Low",
        "rapeseed &mustard": "Model_2_Low",
        "guar seed": "Model_2_Low",
        "other kharif pulses": "Model_2_Low",
        "other rabi pulses": "Model_2_Low",
        "small millets": "Model_2_Low",
        "jowar": "Model_2_Low",
        # Medium yield crops
        "rice": "Model_3_Medium",
        "wheat": "Model_3_Medium",
        "bajra": "Model_3_Medium",
        "maize": "Model_3_Medium",
        "cotton(lint)": "Model_3_Medium",
        "castor seed": "Model_3_Medium",
        "groundnut": "Model_3_Medium",
        "tobacco": "Model_3_Medium",
        "soyabean": "Model_3_Medium",
        "dry chillies": "Model_3_Medium",
        "other cereals": "Model_3_Medium",
        # High veg crops
        "potato": "Model_4_HighVeg",
        "onion": "Model_4_HighVeg",
        "garlic": "Model_4_HighVeg",
        # UltraHigh crops
        "sugarcane": "Model_5_UltraHigh",
        "banana": "Model_5_UltraHigh",
        # Coconut
        "coconut": "Model_6_Coconut",
    }

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._models = {}  # Instance-level models dict
        return cls._instance

    def load_models(self) -> None:
        """Load all models from disk."""
        for model_name, filename in settings.MODEL_FILES.items():
            model_path = settings.MODELS_DIR / filename
            if model_path.exists():
                loaded = joblib.load(model_path)
                # Models are saved as {"model": ..., "preprocessor": ...}
                if isinstance(loaded, dict):
                    model = loaded.get("model")
                    preprocessor = loaded.get("preprocessor")
                    self._models[model_name] = (model, preprocessor)
                else:
                    # Fallback if model is saved directly
                    self._models[model_name] = (loaded, None)
                print(f"Loaded model: {model_name}")
            else:
                print(f"Warning: Model file not found: {model_path}")

    def get_model_for_crop(self, crop: str) -> str:
        """
        Get the appropriate model name for a crop.

        Args:
            crop: Crop name

        Returns:
            Model name to use for prediction
        """
        crop_lower = crop.lower().strip()

        if crop_lower in self.CROP_MODEL_MAPPING:
            return self.CROP_MODEL_MAPPING[crop_lower]

        # Default to Medium model for unknown crops
        return "Model_3_Medium"

    def predict(
        self,
        model_name: str,
        latitude: float,
        longitude: float,
        area_ha: float,
        season: str,
        year: int,
        crop: str,
        soil_ph: Optional[float],
        soil_oc: Optional[float],
        clay_pct: Optional[float],
        sand_pct: Optional[float],
        cec_cmol: Optional[float],
        avg_temp: Optional[float],
        humidity_avg: Optional[float],
        rain_total: Optional[float],
        solar_avg: Optional[float],
    ) -> float:
        """
        Make yield prediction using specified model.

        Args:
            model_name: Name of model to use
            latitude: Location latitude
            longitude: Location longitude
            area_ha: Area in hectares
            soil_*: Soil properties
            *_avg, rain_total: Weather properties

        Returns:
            Predicted yield in quintals per hectare
        """
        if model_name not in self._models:
            raise ValueError(f"Model not loaded: {model_name}")

        model, preprocessor = self._models[model_name]

        # Create DataFrame with feature names matching training data
        features_dict = {
            "Start_Year": [year],
            "Season": [season],
            "Crop": [crop],
            "latitude": [latitude],
            "longitude": [longitude],
            "soil_ph": [soil_ph if soil_ph is not None else 7.0],
            "soil_oc": [soil_oc if soil_oc is not None else 15.0],
            "clay_pct": [clay_pct if clay_pct is not None else 25.0],
            "sand_pct": [sand_pct if sand_pct is not None else 35.0],
            "cec_cmol": [cec_cmol if cec_cmol is not None else 20.0],
            "avg_temp": [avg_temp if avg_temp is not None else 25.0],
            "humidity_avg": [humidity_avg if humidity_avg is not None else 60.0],
            "rain_total": [rain_total if rain_total is not None else 500.0],
            "solar_avg": [solar_avg if solar_avg is not None else 18.0],
            "Area_Ha": [area_ha],
        }

        features_df = pd.DataFrame(features_dict)

        # Apply preprocessor if available
        if preprocessor is not None:
            features_processed = preprocessor.transform(features_df)
        else:
            features_processed = features_df.values

        prediction = model.predict(features_processed)
        return float(prediction[0])


# Singleton instance
model_service = ModelService()

