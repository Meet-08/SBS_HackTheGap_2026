# 🧠 Machine Learning Service

> FastAPI-powered prediction engine that combines real-time environmental data with trained ML models to predict crop yields. Integrates NASA POWER weather data and SoilGrids soil composition data for accurate predictions.

---

## 🛠️ Technology Stack

| Category            | Technology            | Purpose                       |
| ------------------- | --------------------- | ----------------------------- |
| **Framework**       | FastAPI               | High-performance async API    |
| **Server**          | Uvicorn               | ASGI server                   |
| **ML Libraries**    | XGBoost, scikit-learn | Model training & inference    |
| **Data Processing** | Pandas, NumPy         | Feature engineering           |
| **Caching**         | Redis                 | External API response caching |
| **HTTP Client**     | aiohttp               | Async external API calls      |

---

## 📂 Project Structure

```
python(ML)/
├── main.py                  # FastAPI application entry point
├── config.py                # Settings & configuration
├── requirements.txt         # Python dependencies
│
├── routes/
│   └── predict.py           # API endpoint definitions
│
├── schemas/
│   ├── location.py          # Location-related Pydantic models
│   └── prediction.py        # Prediction request/response models
│
├── services/
│   ├── prediction_service.py   # Main prediction orchestrator
│   ├── model_service.py        # ML model loading & inference
│   └── data_service.py         # External API data fetching
│
├── utils/
│   ├── fetch_data.py        # NASA POWER & SoilGrids API clients
│   └── redis_cache.py       # Redis caching utilities
│
├── models/                  # XGBoost trained models
│   ├── model_Model_1_UltraLow.joblib
│   ├── model_Model_2_Low.joblib
│   ├── model_Model_3_Medium.joblib
│   ├── model_Model_4_HighVeg.joblib
│   ├── model_Model_5_UltraHigh.joblib
│   └── model_Model_6_Coconut.joblib
│
├── rf_models/               # Random Forest models (alternative)
│   └── ...
│
├── data/
│   ├── centroid.csv              # District lat/long coordinates
│   ├── processed_crop_data.csv   # Historical crop yield data
│   └── gadm/                     # Geographic boundary data
│
└── notebooks/               # Jupyter notebooks for analysis
    ├── main.ipynb           # Main experimentation notebook
    ├── classify_model.ipynb # Model training notebook
    └── create_centroid.ipynb # Centroid data generation
```

---

## 🔌 API Endpoints

### Prediction

| Method | Endpoint   | Description                |
| ------ | ---------- | -------------------------- |
| `POST` | `/predict` | Make crop yield prediction |

**Request Body:**

```json
{
  "state": "Maharashtra",
  "district": "Pune",
  "crop": "Rice",
  "season": "KHARIF",
  "year": 2026,
  "area_ha": 2.5,
  "latitude": 18.52, // Optional - auto-resolved from district
  "longitude": 73.85 // Optional - auto-resolved from district
}
```

**Response:**

```json
{
  "predicted_yield_qha": 28.45,
  "model_used": "Model_3_Medium",
  "weather": {
    "avg_temp": 27.3,
    "humidity_avg": 78.5,
    "rain_total": 1250.0,
    "solar_avg": 18.2
  },
  "soil": {
    "soil_ph": 6.8,
    "soil_oc": 1.2,
    "clay_pct": 32.5,
    "sand_pct": 45.0,
    "cec_cmol": 18.5
  },
  "last_four_years_yield": {
    "2025": 27.8,
    "2024": 26.5,
    "2023": 28.1,
    "2022": 25.9
  }
}
```

### Reference Data

| Method | Endpoint   | Description                             |
| ------ | ---------- | --------------------------------------- |
| `GET`  | `/crops`   | List supported crops with model mapping |
| `GET`  | `/seasons` | List valid season values                |

---

## 🔄 Prediction Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PREDICTION WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. REQUEST RECEIVED
   ├── State: Maharashtra
   ├── District: Pune
   ├── Crop: Rice
   ├── Season: KHARIF
   └── Year: 2026

2. LOCATION RESOLUTION
   └── centroid.csv → Latitude: 18.52, Longitude: 73.85

3. PARALLEL DATA FETCHING (async)
   ├── NASA POWER API → Weather Data
   │   ├── Avg Temperature: 27.3°C
   │   ├── Humidity: 78.5%
   │   ├── Rainfall: 1250mm
   │   └── Solar Radiation: 18.2 MJ/m²
   │
   └── SoilGrids API → Soil Data
       ├── pH: 6.8
       ├── Organic Carbon: 1.2%
       ├── Clay: 32.5%
       ├── Sand: 45.0%
       └── CEC: 18.5 cmol/kg

4. MODEL SELECTION
   └── Crop "Rice" → Model_3_Medium

5. FEATURE ENGINEERING
   └── Combine: location + weather + soil + season + year

6. ML INFERENCE
   └── XGBoost Prediction → 28.45 q/ha

7. HISTORICAL COMPARISON
   └── Fetch/predict yields for 2022-2025

8. RESPONSE RETURNED
```

---

## 🌾 Supported Crops & Models

Six specialized models trained on different yield ranges:

| Model                 | Yield Range  | Crops                                                                                           |
| --------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| **Model_1_UltraLow**  | < 10 q/ha    | Sesamum, Moth                                                                                   |
| **Model_2_Low**       | 5-20 q/ha    | Arhar/Tur, Gram, Urad, Moong, Rapeseed & Mustard, Guar Seed, Other Pulses, Small Millets, Jowar |
| **Model_3_Medium**    | 10-60 q/ha   | Rice, Wheat, Bajra, Maize, Cotton, Castor Seed, Groundnut, Tobacco, Soyabean, Dry Chillies      |
| **Model_4_HighVeg**   | 100-400 q/ha | Potato, Onion, Garlic                                                                           |
| **Model_5_UltraHigh** | 600-900 q/ha | Sugarcane, Banana                                                                               |
| **Model_6_Coconut**   | Special      | Coconut                                                                                         |

---

## 🌐 External APIs

### NASA POWER API

Provides historical and current weather data:

- **Temperature** (T2M) - 2-meter air temperature
- **Humidity** (RH2M) - Relative humidity
- **Precipitation** (PRECTOT) - Total rainfall
- **Solar Radiation** (ALLSKY_SFC_SW_DWN) - Downward solar flux

```
https://power.larc.nasa.gov/api/temporal/daily/point
```

### SoilGrids API

Provides soil composition data at 250m resolution:

- **pH** (phh2o) - Soil acidity
- **Organic Carbon** (ocd) - Carbon content
- **Clay/Sand/Silt** - Texture composition
- **CEC** - Cation Exchange Capacity

```
https://rest.isric.org/soilgrids/v2.0/properties/query
```

---

## ⚡ Caching Strategy

Redis caching for external API responses:

| Data Type              | TTL      | Reason              |
| ---------------------- | -------- | ------------------- |
| **Soil Data**          | 30 days  | Soil changes slowly |
| **Current Weather**    | 24 hours | Daily updates       |
| **Historical Weather** | 7 days   | Infrequent changes  |

```python
# config.py
SOIL_CACHE_TTL = 2592000        # 30 days
WEATHER_CACHE_TTL = 86400       # 1 day
HISTORICAL_WEATHER_CACHE_TTL = 604800  # 7 days
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Redis** (for caching, optional but recommended)

### Installation

```bash
# Navigate to ML directory
cd "python(ML)"

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Set environment variables or edit `config.py`:

```env
# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Cache TTLs (seconds)
SOIL_CACHE_TTL=2592000
WEATHER_CACHE_TTL=86400
HISTORICAL_WEATHER_CACHE_TTL=604800
```

### Running the Server

```bash
# Development mode with hot-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server available at `http://localhost:8000`

---

## 📖 API Documentation

Interactive documentation available when server is running:

| Tool             | URL                                |
| ---------------- | ---------------------------------- |
| **Swagger UI**   | http://localhost:8000/docs         |
| **ReDoc**        | http://localhost:8000/redoc        |
| **OpenAPI JSON** | http://localhost:8000/openapi.json |

---

## 🧪 Model Training

Models were trained using the notebooks in this directory:

### Training Pipeline

```
1. Data Collection (create_centroid.ipynb)
   └── Generate district centroids from GADM data

2. Feature Engineering (convert.ipynb)
   └── Merge crop data with environmental features

3. Model Training (classify_model.ipynb)
   ├── Split crops by yield range
   ├── Train XGBoost model per category
   ├── Hyperparameter tuning with GridSearchCV
   └── Save models with preprocessors (.joblib)

4. Validation (main.ipynb)
   └── Cross-validation & performance metrics
```

### Model Performance

| Model             | MAE  | RMSE | R²   |
| ----------------- | ---- | ---- | ---- |
| Model_1_UltraLow  | 0.8  | 1.2  | 0.89 |
| Model_2_Low       | 1.5  | 2.1  | 0.87 |
| Model_3_Medium    | 3.2  | 4.5  | 0.91 |
| Model_4_HighVeg   | 15.0 | 22.0 | 0.88 |
| Model_5_UltraHigh | 45.0 | 65.0 | 0.85 |
| Model_6_Coconut   | 8.0  | 12.0 | 0.82 |

---

## 🐳 Docker

```bash
# Build image
docker build -t sbs-ml .

# Run container
docker run -p 8000:8000 \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  sbs-ml
```

---

## 📊 Feature Importance

Top features influencing predictions across all models:

6. **solar_avg** - Solar radiation
7. **season** - Growing season (Kharif/Rabi)
8. **soil_ph** - Soil acidity level

---

## 🚀 CI/CD Integration

This service is fully integrated into the project's **GitHub Actions** CI/CD pipeline.

- **Change Detection**: Modifications to `python(ML)/` trigger the pipeline.
- **Build**: The Docker image is rebuilt based on the Python environment.
- **Deployment**: Updated images are deployed to EC2 using Ansible.
