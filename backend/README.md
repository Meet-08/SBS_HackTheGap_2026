# ⚙️ Backend Service

> Spring Boot REST API serving as the central orchestrator for the Agri-Tech platform. Handles authentication, user management, and coordinates between the frontend and ML prediction service.

---

## 🛠️ Technology Stack

| Category           | Technology               | Version |
| ------------------ | ------------------------ | ------- |
| **Framework**      | Spring Boot              | 3.5.8   |
| **Language**       | Java                     | 25      |
| **Database**       | PostgreSQL               | 16+     |
| **ORM**            | Spring Data JPA          | -       |
| **Security**       | Spring Security 6 + JWT  | -       |
| **AI Integration** | Spring AI (Azure OpenAI) | 1.1.2   |
| **Documentation**  | SpringDoc OpenAPI        | 2.2.0   |
| **Build Tool**     | Gradle                   | 8.x     |

---

## 📂 Project Structure

```
backend/
├── src/main/java/com/meet/sbs/
│   ├── BackendApplication.java    # Application entry point
│   ├── config/                    # Security, OpenAPI, CORS configuration
│   ├── controller/                # REST API endpoints
│   │   ├── AuthController.java    # Authentication endpoints
│   │   └── PredicationController.java  # Prediction endpoints
│   ├── service/                   # Business logic layer
│   │   ├── UserService.java       # User management
│   │   ├── JwtService.java        # JWT token operations
│   │   └── PredicationService.java # Prediction orchestration
│   ├── repository/                # JPA data access interfaces
│   ├── models/                    # JPA Entity classes
│   │   ├── User.java              # User entity
│   │   ├── Prediction.java        # Prediction history
│   │   ├── Location.java          # Geographic data
│   │   ├── WeatherInfo.java       # Weather snapshot
│   │   └── SoilInfo.java          # Soil composition
│   ├── dto/                       # Data Transfer Objects
│   │   ├── user/                  # User-related DTOs
│   │   └── prediction/            # Prediction DTOs
│   ├── exception/                 # Custom exceptions & handlers
│   └── utils/                     # Utility classes
├── src/main/resources/
│   ├── application.yml            # Application configuration
│   └── centroid.csv               # District coordinate mappings
└── build.gradle                   # Gradle build configuration
```

---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| `POST` | `/register` | Register new user | ❌            |
| `POST` | `/login`    | User login        | ❌            |
| `GET`  | `/me`       | Get current user  | ✅            |
| `GET`  | `/logout`   | Logout user       | ✅            |

### Prediction (`/api/v1/predict`)

| Method | Endpoint         | Description                    | Auth Required |
| ------ | ---------------- | ------------------------------ | ------------- |
| `POST` | `/`              | Make yield prediction          | ✅            |
| `POST` | `/ai-suggestion` | Get AI farming recommendations | ✅            |

### OAuth2 (`/oauth2/authorization`)

| Provider | Endpoint                         |
| -------- | -------------------------------- |
| Google   | `/oauth2/authorization/google`   |
| Facebook | `/oauth2/authorization/facebook` |

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Filter Chain                     │
├─────────────────────────────────────────────────────────────┤
│  1. CORS Filter                                              │
│  2. JWT Authentication Filter                                │
│  3. OAuth2 Login Filter (Google, Facebook)                   │
│  4. Authorization (Role-based access)                        │
└─────────────────────────────────────────────────────────────┘
```

**Authentication Flow:**

1. User registers/logs in → Server generates JWT token
2. Token stored in HTTP-only cookie (`X-Access-Token`)
3. Subsequent requests include cookie automatically
4. JWT Filter validates token on protected endpoints

---

## 📋 Request/Response Examples

### Register User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "address": "123 Farm Road",
  "pinCode": "400001"
}
```

### Make Prediction

```bash
POST /api/v1/predict
Content-Type: application/json
Cookie: X-Access-Token=<jwt-token>

{
  "state": "Maharashtra",
  "district": "Pune",
  "crop": "Rice",
  "season": "KHARIF",
  "year": 2026,
  "area_ha": 2.5
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

---

## 🚀 Getting Started

### Prerequisites

- **JDK 25** ([Download](https://jdk.java.net/25/))
- **PostgreSQL 16+** ([Download](https://www.postgresql.org/download/))
- **ML Service** running on port 8000

### Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sbs
    username: your_username
    password: your_password

  application:
    ml-service-url: http://localhost:8000
    frontend-urls: http://localhost:5173

# JWT Configuration
secret-key: your-256-bit-secret-key

# Azure OpenAI (for AI suggestions)
spring.ai.azure.openai:
  api-key: ${AZURE_OPENAI_API_KEY}
  endpoint: ${AZURE_OPENAI_ENDPOINT}
```

### Running the Application

**Using Gradle Wrapper:**

```bash
# Linux/macOS
./gradlew bootRun

# Windows
gradlew.bat bootRun
```

**With custom profile:**

```bash
./gradlew bootRun --args='--spring.profiles.active=dev'
```

The server starts on `http://localhost:8080`

---

## 📖 API Documentation

Interactive API documentation available when the server is running:

| Tool             | URL                                   |
| ---------------- | ------------------------------------- |
| **Swagger UI**   | http://localhost:8080/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8080/v3/api-docs     |

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────────┐
│    users     │     │   predictions    │
├──────────────┤     ├──────────────────┤
│ id (PK)      │◄────┤ user_id (FK)     │
│ email        │     │ id (PK)          │
│ password     │     │ state            │
│ first_name   │     │ district         │
│ last_name    │     │ crop             │
│ address      │     │ season           │
│ pin_code     │     │ year             │
│ created_at   │     │ area_ha          │
└──────────────┘     │ predicted_yield  │
                     │ created_at       │
                     │ weather_info_id  │
                     │ soil_info_id     │
                     └──────────────────┘
```

---

## 🧪 Testing

```bash
# Run all tests
./gradlew test

# Run with coverage report
./gradlew test jacocoTestReport

# Run specific test class
./gradlew test --tests "com.meet.sbs.service.UserServiceTest"
```

---

## 🔧 Build & Deployment

```bash
# Build JAR
./gradlew bootJar

# JAR location
ls build/libs/backend-0.0.1-SNAPSHOT.jar

# Run JAR
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

### Docker

```bash
# Build image
docker build -t sbs-backend .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/sbs \
  sbs-backend
```

### CI/CD Integration

The backend service is part of the project's **GitHub Actions** pipeline. On every push to `main` that modifies this directory:

1. **Build**: `./gradlew bootJar` is executed.
2. **Dockerize**: A new Docker image is built.
3. **Deploy**: The image is pushed to Docker Hub and deployed to the EC2 instance via Ansible.
