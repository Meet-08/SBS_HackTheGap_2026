# Backend Service

The backend service is the backbone of the SBS HackTheGap 2026 system. It is a Spring Boot application that handles business logic, security, and persistence.

## Technology Stack

- **Framework**: Spring Boot 3.5.8
- **Language**: Java 25
- **Database**: PostgreSQL (Spring Data JPA)
- **Security**: Spring Security 6 (JWT Authentication)
- **AI Integration**: Spring AI (Azure OpenAI support)
- **Documentation**: SpringDoc OpenAPI (Swagger UI)

## Architecture

The application follows a standard layered architecture within the `com.meet.sbs` package:

- **`controller/`**: REST endpoints exposing API resources.
- **`service/`**: Business logic layer.
- **`repository/`**: Data access layer using JPA interfaces.
- **`models/`**: JPA Entities representing database tables.
- **`dto/`**: Data Transfer Objects for API requests/responses.
- **`config/`**: Security, OpenAPI, and application configuration.

## Getting Started

### Prerequisites

- Java Development Kit (JDK) 25
- PostgreSQL Database running locally or remotely

### Configuration

The application is configured via `src/main/resources/application.yml`.
Key configurations to check before running:

- **Datasource**: URL, Username, Password for PostgreSQL.
- **JWT Secret**: Token signing key.

### Running the Application

Using the Gradle Wrapper included in the project:

**Linux/macOS:**

```bash
./gradlew bootRun
```

**Windows:**

```cmd
gradlew bootRun
```

The server will start on port `8080` by default.

### API Documentation

Interactive API documentation is available via Swagger UI once the application is running:

- URL: `http://localhost:8080/swagger-ui.html`
