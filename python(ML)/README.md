# Machine Learning (ML) Service

This FastAPI service provides the core intelligence for the SBS HackTheGap 2026 platform. It combines external environmental data with trained ML models to predict crop yields.

## Technology Stack

- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **ML Core**: Scikit-learn, XGBoost
- **Data Processing**: Pandas, NumPy
- **External APIs**: NASA POWER (Weather), SoilGrids (Soil data)

## Core Logic & Workflow

The `PredictionService` (`services/prediction_service.py`) implements the following workflow:

1. **Resolution**: Determines precise Latitude/Longitude for the requested Indian District/State.
2. **Data Fetching**:
   - Fetches historical and current weather data (Solar, Temp, Rain, Humidity) from NASA POWER.
   - Fetches soil composition (pH, Organic Carbon, Clay/Sand %) from SoilGrids.
3. **Inference**:
   - Selects the specific trained model based on the requested Crop.
   - Predicting Yield (Quintals/Hectare) using the aggregated environmental features.
4. **Historical Comparison**:
   - Retrieves or predicts yield values for the previous 4 years to provide trend analysis.

## API Endpoints

- **`POST /predict`**: Main endpoint. Accepts `PredictionRequest` (State, District, Crop, Season, Area) and returns `PredictionResponse`.
- **`GET /crops`**: Lists all supported crops and their corresponding models.
- **`GET /seasons`**: Lists valid seasons for prediction (Kharif, Rabi, etc.).

## Getting Started

### Installation

1. Navigate to the directory:
   ```bash
   cd "python(ML)"
   ```
2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Server

Start the development server with hot-reload:

```bash
python main.py
```

_Alternatively using uvicorn directly:_

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at `http://localhost:8000`.

### Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
