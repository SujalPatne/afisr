import joblib
import os
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../ml/churn_model.pkl')

class ChurnService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            print("Warning: Churn model not found. Using rule-based fallback.")

    def predict_churn(self, attendance_rate: float, test_score_avg: float, fee_status: str) -> dict:
        """
        Predicts churn risk for a student.
        Returns risk level and probability.
        """
        if self.model:
            # ML-based prediction
            input_data = pd.DataFrame({
                'attendance_rate': [attendance_rate],
                'test_score_avg': [test_score_avg],
                'fee_status': [fee_status]
            })
            prob = self.model.predict_proba(input_data)[0][1]
        else:
            # Rule-based fallback
            prob = 0.0
            if attendance_rate < 0.6:
                prob += 0.4
            if test_score_avg < 50:
                prob += 0.3
            if fee_status == 'Overdue':
                prob += 0.3
            prob = min(prob, 1.0)

        # Classification
        if prob >= 0.7:
            risk = 'High'
        elif prob >= 0.4:
            risk = 'Medium'
        else:
            risk = 'Low'

        return {
            'risk_level': risk,
            'churn_probability': round(prob, 2)
        }
