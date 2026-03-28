from flask import Blueprint, request, jsonify
from services.churn_service import ChurnService
from services.insights_service import InsightsService
from services.recommendation_service import RecommendationService

api_bp = Blueprint('api', __name__)
churn_service = ChurnService()

@api_bp.route('/predict_churn', methods=['POST'])
def predict_churn():
    """
    Expects JSON:
    {
        "attendance_rate": 0.85,
        "test_score_avg": 75,
        "fee_status": "Paid"
    }
    """
    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        attendance_rate = float(data.get('attendance_rate', 0))
        test_score_avg = float(data.get('test_score_avg', 0))
        fee_status = data.get('fee_status', 'Pending')

        result = churn_service.predict_churn(attendance_rate, test_score_avg, fee_status)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/franchise_insights', methods=['GET'])
def franchise_insights():
    try:
        insights = InsightsService.get_franchise_insights()
        return jsonify({'insights': insights}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/recommendations', methods=['GET'])
def recommendations():
    try:
        insights = InsightsService.get_franchise_insights()
        recs = RecommendationService.generate_recommendations(insights)
        return jsonify({'recommendations': recs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
