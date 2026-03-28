# Franchise Intelligence System

An AI-powered dashboard and management system designed for Metro Brain Educare Pvt. Ltd. to monitor franchise performance, predict student churn, and generate actionable recommendations.

## Features

- **Admin Data Entry**: Manage franchise centers and student records directly from the UI.
- **Franchise Overview Dashboard**: Visualize key performance indicators (KPIs) like total revenue, enrollments, and average teacher ratings. Includes charts for revenue by center and student performance.
- **Student Churn Predictor**: Uses a rule-based AI model to predict the likelihood of a student dropping out based on attendance, test scores, and fee payment status.
- **AI Recommendations**: Automatically generates actionable insights for franchise centers (e.g., flagging low attendance, poor teacher ratings, or low revenue).

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend**: Node.js, Express, TypeScript
- **State Management**: React Context API
- **Architecture**: Full-stack application with an in-memory database (for prototype purposes) and RESTful API endpoints.

## Project Structure

- `/src/components`: React components (Dashboard, AdminPanel, ChurnPredictor, Recommendations).
- `/src/context`: Global state management (`DataContext.tsx`) that syncs with the backend.
- `/server.ts`: The Express backend server that handles API requests, data storage, and AI logic.
- `/vite.config.ts`: Vite configuration, set up to work alongside the Express server.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs both the Express backend and Vite frontend):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

To build the application for production:
```bash
npm run build
```

To start the production server:
```bash
npm run start
```

## API Endpoints

- `GET /api/data`: Returns all franchises and students.
- `POST /api/franchises`: Adds a new franchise.
- `DELETE /api/franchises/:id`: Deletes a franchise.
- `POST /api/students`: Adds a new student.
- `DELETE /api/students/:id`: Deletes a student.
- `GET /api/franchise_insights`: Returns aggregated performance data for all franchises.
- `POST /api/predict_churn`: Predicts churn risk based on student metrics.
- `GET /api/recommendations`: Returns AI-generated recommendations for franchises.
