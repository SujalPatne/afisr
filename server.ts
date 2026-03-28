import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// In-memory Database with Indian names and locations near Latur, Maharashtra
let franchises = [
  { id: 'f1', name: 'Metro Brain Latur City', location: 'Latur, Maharashtra', manager: 'Rahul Deshmukh', teacher_rating: 4.5 },
  { id: 'f2', name: 'Metro Brain Udgir', location: 'Udgir, Maharashtra', manager: 'Sneha Patil', teacher_rating: 4.2 },
  { id: 'f3', name: 'Metro Brain Ausa', location: 'Ausa, Maharashtra', manager: 'Vikram Kadam', teacher_rating: 3.8 },
  { id: 'f4', name: 'Metro Brain Nilanga', location: 'Nilanga, Maharashtra', manager: 'Pooja Joshi', teacher_rating: 4.7 },
];

let students = [
  { id: 's1', center_id: 'f1', name: 'Aarav Deshmukh', course: 'Abacus Level 1', attendance_rate: 0.95, test_score_avg: 88, fee_status: 'Paid' },
  { id: 's2', center_id: 'f1', name: 'Priya Patil', course: 'Vedic Math', attendance_rate: 0.82, test_score_avg: 75, fee_status: 'Pending' },
  { id: 's3', center_id: 'f2', name: 'Rohan Kadam', course: 'Abacus Level 2', attendance_rate: 0.65, test_score_avg: 55, fee_status: 'Overdue' },
  { id: 's4', center_id: 'f3', name: 'Sneha Joshi', course: 'Vedic Math', attendance_rate: 0.90, test_score_avg: 92, fee_status: 'Paid' },
  { id: 's5', center_id: 'f3', name: 'Amit Shinde', course: 'Abacus Level 1', attendance_rate: 0.70, test_score_avg: 60, fee_status: 'Pending' },
  { id: 's6', center_id: 'f4', name: 'Neha Pawar', course: 'Vedic Math', attendance_rate: 0.98, test_score_avg: 95, fee_status: 'Paid' },
  { id: 's7', center_id: 'f2', name: 'Vikram Jadhav', course: 'Abacus Level 1', attendance_rate: 0.88, test_score_avg: 80, fee_status: 'Paid' },
  { id: 's8', center_id: 'f1', name: 'Pooja More', course: 'Vedic Math', attendance_rate: 0.75, test_score_avg: 68, fee_status: 'Overdue' },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- CRUD API ---
  app.get('/api/data', (req, res) => {
    res.json({ franchises, students });
  });

  app.post('/api/franchises', (req, res) => {
    const newFranchise = { ...req.body, id: `f${Date.now()}` };
    franchises.push(newFranchise);
    res.json(newFranchise);
  });

  app.delete('/api/franchises/:id', (req, res) => {
    franchises = franchises.filter(f => f.id !== req.params.id);
    students = students.filter(s => s.center_id !== req.params.id);
    res.json({ success: true });
  });

  app.post('/api/students', (req, res) => {
    const newStudent = { ...req.body, id: `s${Date.now()}` };
    students.push(newStudent);
    res.json(newStudent);
  });

  app.delete('/api/students/:id', (req, res) => {
    students = students.filter(s => s.id !== req.params.id);
    res.json({ success: true });
  });

  // --- AI / Analytics API ---
  app.get('/api/franchise_insights', (req, res) => {
    const insights = franchises.map(f => {
      const centerStudents = students.filter(s => s.center_id === f.id);
      const total_students = centerStudents.length;
      const avg_student_attendance = total_students > 0 ? centerStudents.reduce((acc, s) => acc + s.attendance_rate, 0) / total_students : 0;
      const avg_student_score = total_students > 0 ? centerStudents.reduce((acc, s) => acc + s.test_score_avg, 0) / total_students : 0;
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
        teacher_rating: f.teacher_rating,
        avg_student_attendance,
        avg_student_score,
        total_students,
        performance_status,
      };
    });
    res.json(insights);
  });

  app.post('/api/predict_churn', (req, res) => {
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

  app.get('/api/recommendations', (req, res) => {
    const recommendations = [];
    franchises.forEach(f => {
      const centerStudents = students.filter(s => s.center_id === f.id);
      const total_students = centerStudents.length;
      
      const avg_attendance = total_students > 0 
        ? centerStudents.reduce((acc, s) => acc + s.attendance_rate, 0) / total_students 
        : 0;

      if (total_students > 0 && avg_attendance < 0.75) {
        recommendations.push({
          center_name: f.name,
          type: 'Attendance',
          message: `Follow up with students at ${f.name} due to low average attendance (${(avg_attendance * 100).toFixed(0)}%).`
        });
      }

      if (f.teacher_rating < 3.5) {
        recommendations.push({
          center_name: f.name,
          type: 'Training',
          message: `Teacher training recommended for ${f.name} (Rating: ${f.teacher_rating}).`
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
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
