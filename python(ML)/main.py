import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

# 1. Define your Map (as provided)
CROP_MAP = {
    "Cereals": [
        "Wheat",
        "Rice",
        "Maize",
        "Bajra",
        "Jowar",
        "Small millets",
        "Other Cereals",
        "Barley",
        "Ragi",
    ],
    "Pulses": [
        "Arhar/Tur",
        "Moong(Green Gram)",
        "Urad",
        "Gram",
        "Masoor",
        "Peas & beans (Pulses)",
        "Moth",
        "Horse-gram",
        "Other Kharif pulses",
        "Other Rabi pulses",
        "Cowpea(Lobia)",
        "Khesari",
    ],
    "Oilseeds": [
        "Groundnut",
        "Castor seed",
        "Rapeseed &Mustard",
        "Niger seed",
        "Safflower",
        "Sesamum",
        "Soyabean",
        "Sunflower",
        "Linseed",
        "other oilseeds",
    ],
    "Fiber": ["Cotton(lint)", "Jute", "Mesta", "Sannhamp"],
    "Cash/Plantation": ["Sugarcane", "Cashewnut", "Arecanut", "Cardamom", "Tobacco"],
    "Vegetables/Tubers": [
        "Potato",
        "Onion",
        "Sweet potato",
        "Tapioca",
        "Garlic",
        "Ginger",
        "Dry Ginger",
    ],
    "Fruits": ["Banana", "Mango", "Papaya", "Pineapple"],
    "Spices/Aromatic": ["Turmeric", "Coriander", "Black pepper", "Dry chillies"],
}

# 2. Invert Map for Routing
# Creates: {'Wheat': 'Cereals', 'Rice': 'Cereals', 'Potato': 'Vegetables/Tubers'...}
crop_lookup = {}
for category, crops in CROP_MAP.items():
    for crop in crops:
        crop_lookup[crop] = category


# 3. Training Function (The "Factory")
def train_specialist_models(df):
    models = {}

    # Loop through each of the 8 categories
    for category in CROP_MAP.keys():
        # a. Filter Data for this Specialist
        subset = df[df["Category_Bio"] == category]

        if len(subset) < 100:
            print(f"Skipping {category}: Not enough data.")
            continue

        # b. Select Algorithm based on Category Characteristics
        if category in ["Pulses", "Spices/Aromatic"]:
            # Use Log-target for low-yield crops to catch small differences
            y = np.log1p(subset["Yield_QHa"])
            model = GradientBoostingRegressor()

        elif category in ["Cash/Plantation", "Fruits", "Vegetables/Tubers"]:
            # Robust trees for high-yield/high-variance crops
            y = subset["Yield_QHa"]
            model = RandomForestRegressor(n_estimators=200)

        else:  # Cereals, Oilseeds, Fiber (Standard)
            y = subset["Yield_QHa"]
            model = XGBRegressor()

        # c. Train
        # replace the features list below with the actual feature columns present in your dataframe
        features = [
            "soil_ph",
            "soil_oc",
            "clay_pct",
            "sand_pct",
            "cec_cmol",
            "rain_total",
            "avg_temp",
        ]
        X = subset[features]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        model.fit(X_train, y_train)

        pred = model.predict(X_test)
        rmse = np.sqrt(np.mean((pred - y_test) ** 2))
        r_sqrt = r2_score(y_test, pred)
        print(f"Trained {category} Model - RMSE: {rmse:.2f}, R^2: {r_sqrt:.2f}")

        # d. Save
        models[category] = model
        os.makedirs("models", exist_ok=True)
        safe_category = category.replace("/", "_")
        joblib.dump(model, f"models/model_{safe_category}.pkl")
        print(f"Trained and Saved: {category}")

    return models


# 4. Prediction Function (The "Architecture")
def predict_yield(crop_name, soil_data):
    # Step 1: Route
    category = crop_lookup.get(crop_name, "Cereals")  # Default to Cereals if unknown

    # Step 2: Load Specialist
    safe_category = category.replace("/", "_")
    model = joblib.load(f"models/model_{safe_category}.pkl")

    # Step 3: Predict
    prediction = model.predict(soil_data)

    # Step 4: Inverse Transform (if needed)
    if category in ["Pulses", "Spices/Aromatic"]:
        prediction = np.expm1(prediction)  # Reverse the log transform

    return prediction


if __name__ == "__main__":
    # Example usage
    df = pd.read_csv("data/enriched_crop_data.csv")

    # Drop outliers / unit mismatches
    df = df[~df["Crop"].isin(["Coconut", "Jack Fruit"])]

    # Create Category_Bio
    df["Category_Bio"] = df["Crop"].map(crop_lookup)

    df = df.dropna(
        subset=[
            "soil_ph",
            "soil_oc",
            "clay_pct",
            "sand_pct",
            "cec_cmol",
            "rain_total",
            "avg_temp",
            "Yield_QHa",
            "Category_Bio",
        ]
    )

    models = train_specialist_models(df)
