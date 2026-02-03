# 🖥️ Frontend Service

> Modern React single-page application for the Agri-Tech crop yield prediction platform. Features a responsive UI with real-time data visualization, secure authentication, and AI-powered farming recommendations.

---

## 🛠️ Technology Stack

| Category             | Technology                       | Version |
| -------------------- | -------------------------------- | ------- |
| **Framework**        | React                            | 19.2    |
| **Language**         | TypeScript                       | 5.9     |
| **Build Tool**       | Vite (Rolldown)                  | 7.2     |
| **Styling**          | TailwindCSS                      | 4.1     |
| **State Management** | Redux Toolkit                    | 2.11    |
| **Routing**          | React Router                     | 7.10    |
| **HTTP Client**      | Axios                            | 1.13    |
| **UI Components**    | Radix UI, Lucide Icons, Recharts | -       |

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component with routing
│   ├── index.css                # Global styles & Tailwind imports
│   │
│   ├── pages/                   # Route page components
│   │   ├── home.tsx             # Landing page
│   │   ├── login.tsx            # User login (email + OAuth)
│   │   ├── register.tsx         # User registration
│   │   ├── forgetpass.tsx       # Password recovery
│   │   ├── predict.tsx          # Prediction input form
│   │   ├── result.tsx           # Prediction results & charts
│   │   └── userDashboard.tsx    # User dashboard
│   │
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── button.tsx       # Button component
│   │   │   ├── card.tsx         # Card container
│   │   │   ├── dialog.tsx       # Modal dialogs
│   │   │   ├── loader.tsx       # Loading spinner
│   │   │   ├── skeleton.tsx     # Loading placeholder
│   │   │   └── ...
│   │   ├── aiSuggestionCard.tsx    # AI recommendations display
│   │   ├── growingConditionCard.tsx # Environmental data cards
│   │   ├── resultCard.tsx          # Prediction summary
│   │   ├── resultChart.tsx         # Historical yield chart
│   │   ├── selectInput.tsx         # Combobox selector
│   │   └── heroslider.tsx          # Landing page slider
│   │
│   ├── redux/                   # State management
│   │   ├── store.ts             # Redux store configuration
│   │   ├── authSlice.ts         # Authentication state
│   │   └── predictionSlice.ts   # Prediction state
│   │
│   ├── lib/                     # Utilities & helpers
│   │   ├── axios.ts             # Axios instance with interceptors
│   │   ├── constants.ts         # Static data (states, districts, crops)
│   │   ├── utils.ts             # Utility functions
│   │   └── growing-conditions.ts # Condition formatting helpers
│   │
│   ├── types/                   # TypeScript definitions
│   │   ├── prediction/          # Prediction-related types
│   │   └── user/                # User-related types
│   │
│   ├── app/                     # App-level utilities
│   │   └── hooks.ts             # Typed Redux hooks
│   │
│   └── css/                     # Component-specific styles
│       ├── login.css
│       ├── register.css
│       └── forgetpass.css
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

---

## 🌐 Pages & Routes

| Route             | Page            | Description                         | Auth Required |
| ----------------- | --------------- | ----------------------------------- | ------------- |
| `/`               | Home            | Landing page with features overview | ❌            |
| `/login`          | Login           | Email/password + OAuth login        | ❌            |
| `/register`       | Register        | New user registration               | ❌            |
| `/forgetpass`     | Forgot Password | Password recovery                   | ❌            |
| `/predict`        | Predict         | Crop yield prediction form          | ✅            |
| `/predict-result` | Result          | Prediction results & charts         | ✅            |
| `/dashboard`      | Dashboard       | User dashboard                      | ✅            |

---

## 🎨 Component Library

Built with **shadcn/ui** components using Radix UI primitives:

| Component  | Description            | Location          |
| ---------- | ---------------------- | ----------------- |
| `Button`   | Primary action buttons | `ui/button.tsx`   |
| `Card`     | Content containers     | `ui/card.tsx`     |
| `Dialog`   | Modal overlays         | `ui/dialog.tsx`   |
| `Popover`  | Dropdown menus         | `ui/popover.tsx`  |
| `Command`  | Searchable combobox    | `ui/command.tsx`  |
| `Skeleton` | Loading placeholders   | `ui/skeleton.tsx` |
| `Loader`   | Animated spinner       | `ui/loader.tsx`   |
| `Badge`    | Status indicators      | `ui/badge.tsx`    |

---

## 📊 State Management

Redux Toolkit slices:

### `authSlice`

```typescript
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Actions:
-registerUser(data) - // Register new user
  loginUser(data) - // Login existing user
  fetchCurrentUser(); // Get logged-in user info
```

### `predictionSlice`

```typescript
interface PredictionState {
  predication: Prediction | null;
  loading: boolean;
  error: string | null;
}

// Actions:
-predict(request); // Make yield prediction
```

---

## 🔌 API Integration

Axios instance configured with:

- Base URL from environment variables
- Automatic cookie handling (`withCredentials: true`)
- Request/response interceptors for auth

```typescript
// lib/axios.ts
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

---

## 🎯 Key Features

### 1. Prediction Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Select     │     │   Submit    │     │   View      │
│  Location   │────▶│   Form      │────▶│   Results   │
│  & Crop     │     │             │     │   & Charts  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2. Result Visualization

- **Yield Card**: Predicted yield with comparison to last year
- **Trend Chart**: 4-year historical yield comparison (Recharts)
- **Environmental Cards**: Weather & soil conditions
- **AI Recommendations**: Personalized farming strategies

### 3. Authentication

- Email/Password registration & login
- OAuth2 (Google, Facebook)
- JWT stored in HTTP-only cookies
- Protected route handling

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 22+** (LTS recommended)
- **npm** or **pnpm**
- Backend service running on port 8080

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Environment Variables

Create `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_OAUTH_URL=http://localhost:8080/oauth2/authorization
```

### Development Server

```bash
npm run dev
```

Application available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Optimized assets generated in `dist/` folder.

---

## 📦 Available Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start development server (HMR enabled) |
| `npm run build`   | TypeScript check + production build    |
| `npm run preview` | Preview production build locally       |
| `npm run lint`    | Run ESLint checks                      |

---

## 🎨 Styling

### TailwindCSS v4

- CSS-first configuration
- Custom color palette for agricultural theme
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`

### Color Theme

```css
:root {
  --background: #faf7f2; /* Warm cream background */
  --foreground: #4a3f35; /* Earthy brown text */
  --primary: #c2592a; /* Terracotta accent */
  --secondary: #6b8e23; /* Olive green */
  --accent: #d9a282; /* Warm tan */
}
```

---

## 📱 Responsive Design

| Breakpoint | Width          | Layout        |
| ---------- | -------------- | ------------- |
| Mobile     | < 640px        | Single column |
| Tablet     | 640px - 1024px | 2 columns     |
| Desktop    | > 1024px       | Full layout   |

---

## 🧪 Code Quality

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🐳 Docker

```bash
# Build image
docker build -t sbs-frontend .

# Run container
docker run -p 5173:5173 sbs-frontend
```

### CI/CD Integration

The frontend service is part of the automated **GitHub Actions** pipeline. When changes are detected in this directory:

1. **Dockerize**: A Docker image is built using the `Dockerfile`.
2. **Push**: The image is pushed to Docker Hub.
3. **Deploy**: The new frontend is automatically deployed to the production environment on EC2.
