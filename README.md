# 🌾 Agri-Tech Crop Yield Prediction Platform

> **SBS HackTheGap 2026** — An AI-powered agricultural intelligence platform that predicts crop yields using machine learning, real-time environmental data, and personalized AI recommendations.

![License](https://img.shields.io/badge/license-MIT-green)
![Java](https://img.shields.io/badge/Java-25-orange)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)

---

## 🎯 Overview

This platform empowers farmers and agricultural stakeholders with data-driven insights for better crop planning and yield optimization. By combining historical agricultural data, real-time environmental conditions, and advanced ML models, it provides accurate yield predictions and actionable recommendations.

### Key Features

- 🌱 **Crop Yield Prediction** — Predict yields (quintals/hectare) for 30+ crops across Indian states and districts
- 🌤️ **Real-time Environmental Data** — Integrates NASA POWER (weather) and SoilGrids (soil composition) APIs
- 🤖 **AI-Powered Recommendations** — Azure OpenAI generates personalized farming strategies
- 📊 **Historical Trend Analysis** — Compare predictions with 4-year yield history
- 🔐 **Secure Authentication** — JWT-based auth with OAuth2 (Google, Facebook) support
- 📱 **Modern UI** — Responsive React interface with real-time data visualization

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│   ML Service    │
│   (React 19)    │     │ (Spring Boot)   │     │   (FastAPI)     │
│   Port: 5173    │     │   Port: 8080    │     │   Port: 8000    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                        ┌────────▼────────┐     ┌────────▼────────┐
                        │   PostgreSQL    │     │     Redis       │
                        │   (User Data)   │     │   (API Cache)   │
                        └─────────────────┘     └─────────────────┘
                                                         │
                                        ┌────────────────┼────────────────┐
                                        │                │                │
                                ┌───────▼───────┐ ┌──────▼──────┐ ┌───────▼───────┐
                                │  NASA POWER   │ │  SoilGrids  │ │ Azure OpenAI  │
                                │  (Weather)    │ │   (Soil)    │ │     (AI)      │
                                └───────────────┘ └─────────────┘ └───────────────┘
```

---

## 📂 Project Structure

```
SBS_HackTheGap_2026/
├── frontend/           # React 19 + TypeScript + TailwindCSS v4
├── backend/            # Spring Boot 3.5 + Java 25 + PostgreSQL
├── python(ML)/         # FastAPI + XGBoost/RandomForest ML Models
├── docker-compose.yml  # Full-stack deployment configuration
├── nginx.conf          # Reverse proxy configuration
└── README.md           # This file
```

| Service        | Technology Stack                                    | Port   | Purpose                        |
| -------------- | --------------------------------------------------- | ------ | ------------------------------ |
| **Frontend**   | React 19, TypeScript, TailwindCSS v4, Redux Toolkit | `5173` | User interface & visualization |
| **Backend**    | Spring Boot 3.5, Java 25, Spring Security, JPA      | `8080` | REST API, auth, orchestration  |
| **ML Service** | FastAPI, XGBoost, scikit-learn, Pandas              | `8000` | Yield prediction engine        |
| **PostgreSQL** | PostgreSQL 16                                       | `5432` | User & prediction storage      |
| **Redis**      | Redis 7                                             | `6379` | External API response caching  |
| **Nginx**      | Nginx                                               | `80`   | Reverse proxy & load balancing |

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended for full deployment)
- Or individually:
  - Node.js 22+ (Frontend)
  - JDK 25 (Backend)
  - Python 3.10+ (ML Service)
  - PostgreSQL 16+
  - Redis 7+

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-repo/SBS_HackTheGap_2026.git
cd SBS_HackTheGap_2026

# Create environment file
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Start all services
docker-compose up -d

# Access the application
open http://localhost
```

### Option 2: Local Development

Start each service in separate terminals:

```bash
# Terminal 1: Frontend
cd frontend
npm install && npm run dev

# Terminal 2: Backend
cd backend
./gradlew bootRun

# Terminal 3: ML Service
cd "python(ML)"
pip install -r requirements.txt
python main.py
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Azure OpenAI (for AI suggestions)
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com

# JWT Secret
SECRET_KEY=your-jwt-secret-key-min-256-bits

# OAuth2 Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

---

## 📚 Service Documentation

Detailed documentation for each service:

| Service       | Documentation                                    | API Docs                                            |
| ------------- | ------------------------------------------------ | --------------------------------------------------- |
| 🖥️ Frontend   | [frontend/README.md](./frontend/README.md)       | N/A                                                 |
| ⚙️ Backend    | [backend/README.md](./backend/README.md)         | [Swagger UI](http://localhost:8080/swagger-ui.html) |
| 🧠 ML Service | [python(ML)/README.md](<./python(ML)/README.md>) | [FastAPI Docs](http://localhost:8000/docs)          |

---

## 🌾 Supported Crops

The platform supports **30+ crops** categorized by yield range:

| Category            | Crops                                | Model             |
| ------------------- | ------------------------------------ | ----------------- |
| **Ultra Low**       | Sesamum, Moth                        | Model_1_UltraLow  |
| **Low**             | Pulses (Gram, Urad, Moong), Oilseeds | Model_2_Low       |
| **Medium**          | Rice, Wheat, Maize, Cotton, Bajra    | Model_3_Medium    |
| **High Vegetables** | Potato, Onion, Garlic                | Model_4_HighVeg   |
| **Ultra High**      | Sugarcane, Banana                    | Model_5_UltraHigh |

---

## 🔄 Data Flow

```
1. User Input (State, District, Crop, Season, Area)
        │
        ▼
2. Backend receives request, validates JWT
        │
        ▼
3. Backend forwards to ML Service
        │
        ▼
4. ML Service:
   ├── Resolves coordinates from district centroid data
   ├── Fetches weather data (NASA POWER API)
   ├── Fetches soil data (SoilGrids API)
   ├── Selects appropriate model based on crop type
   └── Returns prediction with environmental data
        │
        ▼
5. Backend:
   ├── Stores prediction in database
   ├── Calls Azure OpenAI for farming recommendations
   └── Returns complete response to frontend
        │
        ▼
6. Frontend displays:
   ├── Predicted yield (quintals/hectare)
   ├── 4-year historical comparison chart
   ├── Environmental conditions cards
   └── AI-powered farming recommendations
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend && ./gradlew test

# Frontend linting
cd frontend && npm run lint

# ML Service (manual testing via API docs)
# Visit http://localhost:8000/docs
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for **SBS HackTheGap 2026**
