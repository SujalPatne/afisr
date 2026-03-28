class RecommendationService:
    @staticmethod
    def generate_recommendations(franchise_insights: list) -> list:
        """
        Generates actionable recommendations based on franchise data.
        Currently rule-based. Can be extended with LLM integration.
        """
        recommendations = []

        for insight in franchise_insights:
            center_name = insight['name']
            
            if insight['avg_student_attendance'] < 0.75:
                recommendations.append({
                    'center_id': insight['center_id'],
                    'type': 'Attendance',
                    'message': f"Follow up with students at {center_name} due to low average attendance ({insight['avg_student_attendance']*100}%)."
                })
                
            if insight['teacher_rating'] < 3.5:
                recommendations.append({
                    'center_id': insight['center_id'],
                    'type': 'Training',
                    'message': f"Teacher training recommended for {center_name} (Rating: {insight['teacher_rating']})."
                })
                
            if insight['performance_status'] == 'Underperforming':
                recommendations.append({
                    'center_id': insight['center_id'],
                    'type': 'Operations',
                    'message': f"Conduct an operational review for {center_name} to improve revenue and conversions."
                })

        # LLM Integration placeholder
        # if use_llm:
        #     prompt = f"Given these insights: {franchise_insights}, generate 3 strategic recommendations."
        #     return llm_client.generate(prompt)

        return recommendations
