# AI Franchise Intelligence System (AFISR) - Backend

This is the Python Flask backend for the AFISR platform. It provides APIs for student churn prediction, franchise insights, and AI-driven recommendations.

## Tech Stack
- Python 3.9+
- Flask
- PostgreSQL (via SQLAlchemy)
- Scikit-learn (Machine Learning)
- Pandas

## Setup Instructions

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file in the `backend` directory (optional for local SQLite testing):
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/franchise_db
   SECRET_KEY=your_secret_key
   ```
   *Note: If `DATABASE_URL` is not set, it will default to a local SQLite database (`franchise.db`).*

5. **Train the ML Model:**
   Generate the logistic regression model for churn prediction:
   ```bash
   python ml/train_model.py
   ```

6. **Seed the Database:**
   Populate the database with sample franchise and student data:
   ```bash
   python seed_data.py
   ```

7. **Run the Server:**
   ```bash
   python app.py
   ```
   The server will start on `http://127.0.0.1:5000`.

## API Endpoints

### 1. Predict Churn
- **URL:** `/api/predict_churn`
- **Method:** `POST`
- **Body:**
  ```json
  {
      "attendance_rate": 0.55,
      "test_score_avg": 60,
      "fee_status": "Overdue"
  }
  ```
- **Response:**
  ```json
  {
      "churn_probability": 0.7,
      "risk_level": "High"
  }
  ```

### 2. Franchise Insights
- **URL:** `/api/franchise_insights`
- **Method:** `GET`
- **Response:** Returns aggregated metrics and performance status for all centers.

### 3. Recommendations
- **URL:** `/api/recommendations`
- **Method:** `GET`
- **Response:** Returns actionable recommendations based on franchise performance data.
