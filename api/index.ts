import express from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const databaseUrl = process.env.DATABASE_URL || '';
if (!databaseUrl) {
  console.warn('WARNING: DATABASE_URL environment variable is not defined.');
}

const cleanDatabaseUrl = databaseUrl
  .replace('+psycopg', '')
  .replace(/[?&]sslmode=[^&]+/g, '')
  .trim()
  .replace(/^['"]|['"]$/g, '');

const pool = new Pool({
  connectionString: cleanDatabaseUrl,
  ssl: { rejectUnauthorized: false }
});

const router = express.Router();

// ─────────────────────────────────────────
// EXISTING: Core Data
// ─────────────────────────────────────────

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

// ─────────────────────────────────────────
// EXISTING: Insights & Churn
// ─────────────────────────────────────────

router.get('/franchise_insights', async (req, res) => {
  try {
    const { rows: franchises } = await pool.query('SELECT * FROM franchises');
    const { rows: students } = await pool.query('SELECT * FROM students');
    const { rows: feeRows } = await pool.query("SELECT center_id, SUM(amount) as total FROM fees WHERE status = 'Paid' GROUP BY center_id");

    const revenueMap: Record<string, number> = {};
    feeRows.forEach(r => { revenueMap[r.center_id] = Number(r.total); });

    const insights = franchises.map(f => {
      const centerStudents = students.filter(s => s.center_id === f.id);
      const total_students = centerStudents.length;
      const tScoreSum = centerStudents.reduce((acc, s) => acc + Number(s.test_score_avg), 0);
      const attendanceSum = centerStudents.reduce((acc, s) => acc + Number(s.attendance_rate), 0);
      const avg_student_attendance = total_students > 0 ? attendanceSum / total_students : 0;
      const avg_student_score = total_students > 0 ? tScoreSum / total_students : 0;
      // Use actual fee revenue if available, fallback to estimate
      const revenue = revenueMap[f.id] || total_students * 15000;
      
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
    console.error(error);
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

// ─────────────────────────────────────────
// NEW: Fee Management
// ─────────────────────────────────────────

// Get all fees (with optional filters)
router.get('/fees', async (req, res) => {
  try {
    const { center_id, student_id, status } = req.query;
    let query = `
      SELECT f.*, s.name as student_name, fr.name as center_name 
      FROM fees f 
      JOIN students s ON f.student_id = s.id 
      JOIN franchises fr ON f.center_id = fr.id
    `;
    const conditions: string[] = [];
    const params: any[] = [];

    if (center_id) {
      params.push(center_id);
      conditions.push(`f.center_id = $${params.length}`);
    }
    if (student_id) {
      params.push(student_id);
      conditions.push(`f.student_id = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`f.status = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY f.due_date DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows.map(r => ({ ...r, amount: Number(r.amount) })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fee dashboard summary
router.get('/fees/summary', async (req, res) => {
  try {
    const { rows: summary } = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'Paid') as paid_count,
        COUNT(*) FILTER (WHERE status = 'Pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'Overdue') as overdue_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Paid'), 0) as total_collected,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Pending'), 0) as total_pending,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Overdue'), 0) as total_overdue,
        COALESCE(SUM(amount), 0) as total_expected
      FROM fees
    `);
    
    const { rows: byCenter } = await pool.query(`
      SELECT 
        f.center_id,
        fr.name as center_name,
        COUNT(*) FILTER (WHERE f.status = 'Paid') as paid_count,
        COUNT(*) FILTER (WHERE f.status != 'Paid') as unpaid_count,
        COALESCE(SUM(f.amount) FILTER (WHERE f.status = 'Paid'), 0) as collected,
        COALESCE(SUM(f.amount) FILTER (WHERE f.status != 'Paid'), 0) as outstanding
      FROM fees f
      JOIN franchises fr ON f.center_id = fr.id
      GROUP BY f.center_id, fr.name
      ORDER BY outstanding DESC
    `);

    const { rows: overdueStudents } = await pool.query(`
      SELECT 
        f.student_id,
        s.name as student_name,
        fr.name as center_name,
        COUNT(*) as overdue_months,
        SUM(f.amount) as total_overdue
      FROM fees f
      JOIN students s ON f.student_id = s.id
      JOIN franchises fr ON f.center_id = fr.id
      WHERE f.status = 'Overdue'
      GROUP BY f.student_id, s.name, fr.name
      ORDER BY total_overdue DESC
    `);

    res.json({
      totals: {
        paid_count: Number(summary[0].paid_count),
        pending_count: Number(summary[0].pending_count),
        overdue_count: Number(summary[0].overdue_count),
        total_collected: Number(summary[0].total_collected),
        total_pending: Number(summary[0].total_pending),
        total_overdue: Number(summary[0].total_overdue),
        total_expected: Number(summary[0].total_expected),
        collection_rate: Number(summary[0].total_expected) > 0 
          ? Number(summary[0].total_collected) / Number(summary[0].total_expected) 
          : 0
      },
      by_center: byCenter.map(r => ({
        ...r,
        collected: Number(r.collected),
        outstanding: Number(r.outstanding),
        paid_count: Number(r.paid_count),
        unpaid_count: Number(r.unpaid_count)
      })),
      overdue_students: overdueStudents.map(r => ({
        ...r,
        overdue_months: Number(r.overdue_months),
        total_overdue: Number(r.total_overdue)
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Record a payment
router.post('/fees/:id/pay', async (req, res) => {
  try {
    const { payment_method } = req.body;
    const { rows } = await pool.query(
      `UPDATE fees SET status = 'Paid', paid_date = CURRENT_DATE, payment_method = $1 WHERE id = $2 RETURNING *`,
      [payment_method || 'Cash', req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Fee record not found' });
    res.json({ ...rows[0], amount: Number(rows[0].amount) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new fee record
router.post('/fees', async (req, res) => {
  const { student_id, center_id, amount, due_date, month_label } = req.body;
  const id = `fee_${Date.now()}`;
  try {
    await pool.query(
      `INSERT INTO fees (id, student_id, center_id, amount, due_date, status, month_label) VALUES ($1, $2, $3, $4, $5, 'Pending', $6)`,
      [id, student_id, center_id, amount, due_date, month_label]
    );
    res.json({ id, student_id, center_id, amount, due_date, status: 'Pending', month_label });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────
// NEW: Alerts / Today's Focus
// ─────────────────────────────────────────

// Get active alerts (for Today's Focus inbox)
router.get('/alerts', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, s.name as student_name, f.name as center_name
      FROM alerts a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN franchises f ON a.center_id = f.id
      WHERE a.is_dismissed = false
      ORDER BY 
        CASE a.severity 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
          WHEN 'info' THEN 5 
        END,
        a.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get unread alert count
router.get('/alerts/count', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) as count FROM alerts WHERE is_dismissed = false AND is_read = false`
    );
    res.json({ count: Number(rows[0].count) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark alert as read
router.patch('/alerts/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE alerts SET is_read = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Dismiss alert
router.patch('/alerts/:id/dismiss', async (req, res) => {
  try {
    await pool.query('UPDATE alerts SET is_dismissed = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/test-db', async (req, res) => {
  try {
    const url = process.env.DATABASE_URL || '';
    const sanitizedUrl = url ? url.replace(/:[^:@]+@/, ':***@') : 'NOT DEFINED';
    
    const hasQuotes = (url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"));
    const cleanUrl = url
      .replace('+psycopg', '')
      .replace(/[?&]sslmode=[^&]+/g, '')
      .trim()
      .replace(/^['"]|['"]$/g, '');
    
    const testPool = new Pool({
      connectionString: cleanUrl,
      ssl: { rejectUnauthorized: false }
    });
    
    const start = Date.now();
    const { rows } = await testPool.query('SELECT 1 as val');
    await testPool.end();
    
    res.json({
      success: true,
      sanitizedUrl,
      hasQuotes,
      urlLength: url.length,
      elapsedMs: Date.now() - start,
      queryResult: rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      sanitizedUrl: (process.env.DATABASE_URL || '').replace(/:[^:@]+@/, ':***@'),
      urlLength: (process.env.DATABASE_URL || '').length
    });
  }
});

// Use both /api and / to handle different invocations cleanly
app.use('/api', router);
app.use('/', router);

export default app;
