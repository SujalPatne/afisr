from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True)
    center_id = db.Column(db.Integer, db.ForeignKey('franchises.center_id'))
    attendance_rate = db.Column(db.Float)
    test_score_avg = db.Column(db.Float)
    fee_status = db.Column(db.String(50)) # 'Paid', 'Pending', 'Overdue'
    churn_label = db.Column(db.Boolean, default=False)

class Franchise(db.Model):
    __tablename__ = 'franchises'
    center_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    revenue = db.Column(db.Float)
    enrollments = db.Column(db.Integer)
    teacher_rating = db.Column(db.Float)
    students = db.relationship('Student', backref='franchise', lazy=True)
