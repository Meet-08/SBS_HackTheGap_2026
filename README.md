# SBS HackTheGap 2026 Project

Welcome to the SBS HackTheGap 2026 project repository. This application is a comprehensive multi-service platform designed to predict crop yields and provide agricultural insights. It consists of a modern React frontend, a robust Spring Boot backend, and a specialized Python Machine Learning service.

## Project Structure

The project is organized into three main component directories, each serving a distinct role in the architecture:

- **`frontend/`**: The client-side application built with **React 19** and **TypeScript**, styled with **TailwindCSS v4**. It handles user authentication, dashboard visualization, and prediction requests.
- **`backend/`**: The core API server built with **Spring Boot 3.5.8** and **Java 25**. It manages user data, authentication (JWT), and acts as an orchestrator between the frontend and the ML service.
- **`python(ML)/`**: The dedicated Machine Learning service built with **FastAPI**. It integrates with environmental APIs (NASA POWER, SoilGrids) and runs XGBoost/Random Forest models to generate yield predictions.

## Service Overview

| Service        | Port   | Description                                     |
| -------------- | ------ | ----------------------------------------------- |
| **Frontend**   | `5173` | Web User Interface (Vite Dev Server)            |
| **Backend**    | `8080` | Main REST API & Database Interaction            |
| **ML Service** | `8000` | Prediction Engine & Environmental Data Fetching |

## Getting Started

To run the full application locally, you will need to start each service individually. Please refer to the specific documentation in each directory for detailed instructions:

- [Frontend Documentation](./frontend/README.md) - Setup, pages, and components.
- [Backend Documentation](./backend/README.md) - Configuration, database, and API details.
- [ML Service Documentation](<./python(ML)/README.md>) - Model models, endpoints, and data workflow.
