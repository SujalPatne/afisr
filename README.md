# Franchise Intelligence System (AFISR)

An active, database-driven operations and intelligence platform designed for Metro Brain Educare Pvt. Ltd. to monitor franchise performance, track collections, manage students, predict churn risk, and drive daily administrative focus.

---

## 🚀 Key Features

*   **Today's Focus Inbox**: The default system landing page. An actionable inbox that surfaces critical, priority-sorted alerts (Critical, High, Medium, Low, Info) such as overdue fees, drops in student attendance or test scores, and student wins. Alerts can be marked as read or dismissed directly, with real-time sidebar notification counts.
*   **Center Insights** (formerly *Franchise Overview*): A KPI dashboard visualizing network-wide health including enrollments, teacher ratings, and actual fee revenues. Features interactive charts (revenue by center and student performance breakdown).
*   **Fee Collection Dashboard**: End-to-end fee tracking showing total collected, pending, and overdue amounts. Includes a collection-by-center stacked bar chart, payment status donut chart, overdue student tracking, and a filterable history table with inline "Record Payment" functionality.
*   **Who Might Drop Out?** (formerly *Student Churn Predictor*): An analytics panel mapping student churn risk levels (High, Medium, Low) using rule-based calculations from attendance rates, test scores, and fee standing.
*   **Student Progress**: Detailed tracking of academic and attendance trends per student to monitor individual student performance curves over time.
*   **Action Items** (formerly *AI Recommendations*): Proactive recommendations automatically generated per center (e.g. low teacher rating warnings, low attendance alerts, or operational revenue audits).
*   **Manage Data** (formerly *Admin Data Entry*): Administrative panel for managing franchise centers and student listings directly from the UI.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide React
*   **Backend**: Node.js, Express, TypeScript, native environment loading (`dotenv`)
*   **Database**: PostgreSQL / TimescaleDB (hosted on TimescaleDB Cloud)
*   **State Management**: React Context API (`DataContext.tsx`) with real-time API synchronization

---

## 📁 Project Structure

*   `/src/components/`: React UI views (`TodaysFocus.tsx`, `Dashboard.tsx`, `FeesDashboard.tsx`, `StudentProgress.tsx`, `ChurnPredictor.tsx`, `Recommendations.tsx`, `AdminPanel.tsx`).
*   `/src/context/`: Global React state context (`DataContext.tsx`) synchronizing with backend APIs.
*   `/api/index.ts`: Express router handling database queries, aggregations, fee management, and alert operations.
*   `/server.ts`: Express entrypoint running Vite middleware in dev, and hosting static assets in production.
*   `/db_setup.js`: Database initialization and seeding script.

---

## ⚙️ Getting Started

### 📋 Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A running PostgreSQL or TimescaleDB database instance

### 🔧 Installation & Database Setup

1.  **Clone and Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    Create a `.env` file in the root directory based on `.env.example`:
    ```env
    DATABASE_URL="postgresql://username:password@host:port/dbname"
    GEMINI_API_KEY="your_api_key_here"
    APP_URL="http://localhost:3000"
    ```

3.  **Initialize & Seed Database**:
    Run the setup script to create tables (`franchises`, `students`) and seed initial mock data:
    ```bash
    node db_setup.js
    ```

4.  **Run Development Server**:
    Starts both the Express backend and Vite frontend concurrently:
    ```bash
    npm run dev
    ```

5.  **Access the Application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

Build frontend production bundle:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

---

## 🌐 API Endpoints

### Core Data & Administration
*   `GET /api/data`: Returns all franchises and students.
*   `POST /api/franchises`: Add a new franchise center.
*   `DELETE /api/franchises/:id`: Delete a franchise center.
*   `POST /api/students`: Add a new student record.
*   `DELETE /api/students/:id`: Delete a student record.

### Insights & Churn Analytics
*   `GET /api/franchise_insights`: Aggregated KPIs, revenues, and statuses by center.
*   `POST /api/predict_churn`: Calculates drop-out probabilities.
*   `GET /api/recommendations`: Fetch system recommendations / Action Items.

### Fee Management
*   `GET /api/fees`: Fetch fee records (filterable by `center_id`, `student_id`, `status`).
*   `GET /api/fees/summary`: Collections metrics, center-wise aggregations, and overdue students.
*   `POST /api/fees`: Create a new pending fee record.
*   `POST /api/fees/:id/pay`: Record/update a payment (sets status to 'Paid' and captures payment method).

### Alerting & Today's Focus
*   `GET /api/alerts`: Active, severity-sorted alerts.
*   `GET /api/alerts/count`: Current unread alert count.
*   `PATCH /api/alerts/:id/read`: Mark alert as read.
*   `PATCH /api/alerts/:id/dismiss`: Mark alert as dismissed.
