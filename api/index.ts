import express from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const rawUrl = process.env.DATABASE_URL || 'postgresql://tsdbadmin:fkg5r0atfl1dun5e@bfcl9opdwz.ikysjdfisk.tsdb.cloud.timescale.com:32129/tsdb';
const pool = new Pool({
  connectionString: rawUrl.replace('+psycopg', ''),
  ssl: { rejectUnauthorized: false }
});

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const { rows: franchises } = await pool.query('SELECT * FROM franchises');
    const { rows: students } = await pool.query('SELECT * FROM students');
    
    res.json({
      franchises: franchises.map(f => ({...f, teacher_rating: Number(f.teacher_rating)})),
      students: students.map(s => ({
        ...s, 
        attendance_rate: Number(s.attendance_rate), 
        test_score_avg: Number(s.test_score_avg)
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/franchises', async (req, res) => {
  const newFranchise = { ...req.body, id: `f${Date.now()}` };
  try {
    await pool.query(
      'INSERT INTO franchises (id, name, location, manager, teacher_rating) VALUES ($1, $2, $3, $4, $5)',
      [newFranchise.id, newFranchise.name, newFranchise.location, newFranchise.manager, newFranchise.teacher_rating || 0]
    );
    res.json(newFranchise);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/franchises/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM franchises WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/students', async (req, res) => {
  const newStudent = { ...req.body, id: `s${Date.now()}` };
  try {
    await pool.query(
      'INSERT INTO students (id, center_id, name, course, attendance_rate, test_score_avg, fee_status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [newStudent.id, newStudent.center_id, newStudent.name, newStudent.course, newStudent.attendance_rate, newStudent.test_score_avg, newStudent.fee_status]
    );
    res.json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/franchise_insights', async (req, res) => {
  try {
    const { rows: franchises } = await pool.query('SELECT * FROM franchises');
    const { rows: students } = await pool.query('SELECT * FROM students');

    const insights = franchises.map(f => {
      const centerStudents = students.filter(s => s.center_id === f.id);
      const total_students = centerStudents.length;
      const tScoreSum = centerStudents.reduce((acc, s) => acc + Number(s.test_score_avg), 0);
      const attendanceSum = centerStudents.reduce((acc, s) => acc + Number(s.attendance_rate), 0);
      const avg_student_attendance = total_students > 0 ? attendanceSum / total_students : 0;
      const avg_student_score = total_students > 0 ? tScoreSum / total_students : 0;
      const revenue = total_students * 15000;
      
      let performance_status = 'Healthy';
      if (revenue < 50000 || avg_student_attendance < 0.7) {
        performance_status = 'Underperforming';
      }

      return {
        center_id: f.id,
        name: f.name,
        revenue,
        enrollments: total_students,
        teacher_rating: Number(f.teacher_rating),
        avg_student_attendance,
        avg_student_score,
        total_students,
        performance_status,
      };
    });
    res.json(insights);
  } catch(error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/predict_churn', (req, res) => {
  const { attendance, score, feeStatus } = req.body;
  let riskScore = 0;
  if (attendance < 0.75) riskScore += 40;
  else if (attendance < 0.85) riskScore += 20;

  if (score < 50) riskScore += 40;
  else if (score < 70) riskScore += 20;

  if (feeStatus === 'Overdue') riskScore += 20;
  else if (feeStatus === 'Pending') riskScore += 10;

  let risk_level = 'Low';
  if (riskScore >= 70) risk_level = 'High';
  else if (riskScore >= 40) risk_level = 'Medium';

  res.json({
    risk_level,
    churn_probability: Math.min(riskScore, 99) / 100
  });
});

router.get('/recommendations', async (req, res) => {
  try {
    const { rows: franchises } = await pool.query('SELECT * FROM franchises');
    const { rows: students } = await pool.query('SELECT * FROM students');
    const recommendations: any[] = [];
    
    franchises.forEach(f => {
      const centerStudents = students.filter(s => s.center_id === f.id);
      const total_students = centerStudents.length;
      
      const attendanceSum = centerStudents.reduce((acc, s) => acc + Number(s.attendance_rate), 0);
      const avg_attendance = total_students > 0 ? attendanceSum / total_students : 0;

      if (total_students > 0 && avg_attendance < 0.75) {
        recommendations.push({
          center_name: f.name,
          type: 'Attendance',
          message: `Follow up with students at ${f.name} due to low average attendance ${(avg_attendance * 100).toFixed(0)}%.`
        });
      }

      const rating = Number(f.teacher_rating);
      if (rating < 3.5) {
        recommendations.push({
          center_name: f.name,
          type: 'Training',
          message: `Teacher training recommended for ${f.name} (Rating: ${rating}).`
        });
      }

      const revenue = total_students * 15000;
      if (revenue < 50000 && total_students > 0) {
        recommendations.push({
          center_name: f.name,
          type: 'Operations',
          message: `Conduct an operational review for ${f.name} to improve revenue and conversions.`
        });
      }
    });

    res.json(recommendations);
  } catch(error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Use both /api and / to handle different invocations cleanly
app.use('/api', router);
app.use('/', router);

export default app;
