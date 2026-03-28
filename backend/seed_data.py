from app import create_app
from models.database import db, Franchise, Student

def seed():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Add Franchises
        f1 = Franchise(name="Downtown Center", revenue=120000, enrollments=150, teacher_rating=4.5)
        f2 = Franchise(name="Westside Branch", revenue=45000, enrollments=60, teacher_rating=3.2)
        f3 = Franchise(name="North Hills Hub", revenue=85000, enrollments=110, teacher_rating=4.0)

        db.session.add_all([f1, f2, f3])
        db.session.commit()

        # Add Students
        students = [
            Student(center_id=f1.center_id, attendance_rate=0.95, test_score_avg=88, fee_status='Paid'),
            Student(center_id=f1.center_id, attendance_rate=0.80, test_score_avg=75, fee_status='Pending'),
            Student(center_id=f2.center_id, attendance_rate=0.50, test_score_avg=45, fee_status='Overdue'),
            Student(center_id=f2.center_id, attendance_rate=0.65, test_score_avg=55, fee_status='Overdue'),
            Student(center_id=f3.center_id, attendance_rate=0.90, test_score_avg=82, fee_status='Paid'),
        ]

        db.session.add_all(students)
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed()
