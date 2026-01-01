# Frontend Service

This directory contains the client-side application for the SBS HackTheGap 2026 project. It is a modern single-page application (SPA) focused on providing a seamless user experience for crop yield prediction.

## Technology Stack

- **Core**: React 19, TypeScript
- **Build Tool**: Vite (Rolldown)
- **Styling**: TailwindCSS v4
- **State Management**: Redux Toolkit (with React-Redux)
- **Routing**: React Router v7
- **UI Components**: Radix UI Primitives, Lucide React Icons
- **HTTP Client**: Axios

## Project Structure

The source code is organized as follows:

- **`src/pages/`**: Main application views.
  - `home.tsx`: Landing page.
  - `login.tsx` / `register.tsx`: User authentication including Google Sign-in integration.
  - `userDashboard.tsx`: Main user hub after login.
  - `predict.tsx`: Form for inputting crop and location data.
  - `result.tsx`: Visualizes the prediction output (Yield, Weather, Soil data).
- **`src/components/`**: Reusable UI components.
- **`src/redux/`**: State slices and store configuration.
- **`src/types/`**: TypeScript definitions for API responses and component props.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the high-performance Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

Artifacts will be generated in the `dist` folder.
