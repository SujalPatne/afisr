import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os

def train_and_save_model():
    # Sample data creation
    data = {
        'attendance_rate': [0.95, 0.80, 0.60, 0.90, 0.50, 0.85, 0.40, 0.75, 0.99, 0.65],
        'test_score_avg': [85, 70, 55, 88, 45, 75, 40, 65, 95, 50],
        'fee_status': ['Paid', 'Paid', 'Overdue', 'Pending', 'Overdue', 'Paid', 'Overdue', 'Pending', 'Paid', 'Pending'],
        'churn_label': [0, 0, 1, 0, 1, 0, 1, 0, 0, 1]
    }
    df = pd.DataFrame(data)

    X = df[['attendance_rate', 'test_score_avg', 'fee_status']]
    y = df['churn_label']

    # Preprocessing pipeline
    numeric_features = ['attendance_rate', 'test_score_avg']
    categorical_features = ['fee_status']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    # Model pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression())
    ])

    model.fit(X, y)

    # Save model
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    joblib.dump(model, os.path.join(os.path.dirname(__file__), 'churn_model.pkl'))
    print("Model trained and saved to churn_model.pkl")

if __name__ == '__main__':
    train_and_save_model()
