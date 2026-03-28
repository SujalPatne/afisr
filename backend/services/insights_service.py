from models.database import Franchise, Student, db
from sqlalchemy import func

class InsightsService:
    @staticmethod
    def get_franchise_insights():
        """
        Aggregates performance metrics across all franchises.
        """
        franchises = Franchise.query.all()
        insights = []

        for f in franchises:
            # Calculate average attendance and test scores for this franchise
            stats = db.session.query(
                func.avg(Student.attendance_rate).label('avg_attendance'),
                func.avg(Student.test_score_avg).label('avg_score'),
                func.count(Student.student_id).label('total_students')
            ).filter(Student.center_id == f.center_id).first()

            avg_attendance = stats.avg_attendance or 0
            avg_score = stats.avg_score or 0
            total_students = stats.total_students or 0

            # Determine performance status
            status = 'Healthy'
            if f.revenue < 50000 or avg_attendance < 0.7:
                status = 'Underperforming'

            insights.append({
                'center_id': f.center_id,
                'name': f.name,
                'revenue': f.revenue,
                'enrollments': f.enrollments,
                'teacher_rating': f.teacher_rating,
                'avg_student_attendance': round(avg_attendance, 2),
                'avg_student_score': round(avg_score, 2),
                'total_students': total_students,
                'performance_status': status
            })

        return insights
