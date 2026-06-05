import 'dotenv/config';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL is not set in your environment.");
  process.exit(1);
}

const franchises = [
  { id: 'f1', name: 'Metro Brain Latur City', location: 'Latur, Maharashtra', manager: 'Rahul Deshmukh', teacher_rating: 4.5 },
  { id: 'f2', name: 'Metro Brain Udgir', location: 'Udgir, Maharashtra', manager: 'Sneha Patil', teacher_rating: 4.2 },
  { id: 'f3', name: 'Metro Brain Ausa', location: 'Ausa, Maharashtra', manager: 'Vikram Kadam', teacher_rating: 3.8 },
  { id: 'f4', name: 'Metro Brain Nilanga', location: 'Nilanga, Maharashtra', manager: 'Pooja Joshi', teacher_rating: 4.7 },
];

const students = [
  { id: 's1', center_id: 'f1', name: 'Aarav Deshmukh', course: 'Abacus Level 1', attendance_rate: 0.95, test_score_avg: 88, fee_status: 'Paid' },
  { id: 's2', center_id: 'f1', name: 'Priya Patil', course: 'Vedic Math', attendance_rate: 0.82, test_score_avg: 75, fee_status: 'Pending' },
  { id: 's3', center_id: 'f2', name: 'Rohan Kadam', course: 'Abacus Level 2', attendance_rate: 0.65, test_score_avg: 55, fee_status: 'Overdue' },
  { id: 's4', center_id: 'f3', name: 'Sneha Joshi', course: 'Vedic Math', attendance_rate: 0.90, test_score_avg: 92, fee_status: 'Paid' },
  { id: 's5', center_id: 'f3', name: 'Amit Shinde', course: 'Abacus Level 1', attendance_rate: 0.70, test_score_avg: 60, fee_status: 'Pending' },
  { id: 's6', center_id: 'f4', name: 'Neha Pawar', course: 'Vedic Math', attendance_rate: 0.98, test_score_avg: 95, fee_status: 'Paid' },
  { id: 's7', center_id: 'f2', name: 'Vikram Jadhav', course: 'Abacus Level 1', attendance_rate: 0.88, test_score_avg: 80, fee_status: 'Paid' },
  { id: 's8', center_id: 'f1', name: 'Pooja More', course: 'Vedic Math', attendance_rate: 0.75, test_score_avg: 68, fee_status: 'Overdue' },
];

const users = [
  { id: 'u1', username: 'hq_admin', password_hash: '$2b$10$xyz...', role: 'hq_admin', center_id: null },
  { id: 'u2', username: 'teacher_latur', password_hash: '$2b$10$xyz...', role: 'teacher', center_id: 'f1' }
];

const batches = [
  { id: 'b1', center_id: 'f1', name: 'Abacus Level 1 Morning', timing: 'Mon-Wed-Fri 9:00 AM - 10:30 AM', teacher_id: 'u2', capacity: 15 },
  { id: 'b2', center_id: 'f1', name: 'Vedic Math Evening', timing: 'Tue-Thu 4:00 PM - 5:30 PM', teacher_id: 'u2', capacity: 12 },
  { id: 'b3', center_id: 'f2', name: 'Abacus Level 2 Weekend', timing: 'Sat-Sun 10:00 AM - 12:00 PM', teacher_id: null, capacity: 10 },
  { id: 'b4', center_id: 'f3', name: 'Vedic Math Beginner', timing: 'Wed-Fri 3:30 PM - 5:00 PM', teacher_id: null, capacity: 15 },
  { id: 'b5', center_id: 'f4', name: 'Advanced Abacus', timing: 'Tue-Thu 5:30 PM - 7:00 PM', teacher_id: null, capacity: 8 }
];

// Seed 40 fee records: collected (Paid) = 77.5k, pending = 7.5k, overdue = 15k
// At 2500 per record, that's exactly 31 Paid, 3 Pending, 6 Overdue.
const fees = [
  // s1: 5 Paid
  { id: 'fee_s1_jan', student_id: 's1', center_id: 'f1', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-08', payment_method: 'Cash' },
  { id: 'fee_s1_feb', student_id: 's1', center_id: 'f1', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-09', payment_method: 'UPI' },
  { id: 'fee_s1_mar', student_id: 's1', center_id: 'f1', amount: 2500, due_date: '2026-03-10', status: 'Paid', month_label: 'Mar 2026', paid_date: '2026-03-05', payment_method: 'UPI' },
  { id: 'fee_s1_apr', student_id: 's1', center_id: 'f1', amount: 2500, due_date: '2026-04-10', status: 'Paid', month_label: 'Apr 2026', paid_date: '2026-04-10', payment_method: 'Card' },
  { id: 'fee_s1_may', student_id: 's1', center_id: 'f1', amount: 2500, due_date: '2026-05-10', status: 'Paid', month_label: 'May 2026', paid_date: '2026-05-09', payment_method: 'UPI' },

  // s2: 4 Paid, 1 Pending
  { id: 'fee_s2_jan', student_id: 's2', center_id: 'f1', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-10', payment_method: 'UPI' },
  { id: 'fee_s2_feb', student_id: 's2', center_id: 'f1', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-07', payment_method: 'Cash' },
  { id: 'fee_s2_mar', student_id: 's2', center_id: 'f1', amount: 2500, due_date: '2026-03-10', status: 'Paid', month_label: 'Mar 2026', paid_date: '2026-03-10', payment_method: 'UPI' },
  { id: 'fee_s2_apr', student_id: 's2', center_id: 'f1', amount: 2500, due_date: '2026-04-10', status: 'Paid', month_label: 'Apr 2026', paid_date: '2026-04-09', payment_method: 'UPI' },
  { id: 'fee_s2_may', student_id: 's2', center_id: 'f1', amount: 2500, due_date: '2026-05-10', status: 'Pending', month_label: 'May 2026', paid_date: null, payment_method: null },

  // s3: 2 Paid, 3 Overdue
  { id: 'fee_s3_jan', student_id: 's3', center_id: 'f2', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-12', payment_method: 'Cash' },
  { id: 'fee_s3_feb', student_id: 's3', center_id: 'f2', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-10', payment_method: 'Cash' },
  { id: 'fee_s3_mar', student_id: 's3', center_id: 'f2', amount: 2500, due_date: '2026-03-10', status: 'Overdue', month_label: 'Mar 2026', paid_date: null, payment_method: null },
  { id: 'fee_s3_apr', student_id: 's3', center_id: 'f2', amount: 2500, due_date: '2026-04-10', status: 'Overdue', month_label: 'Apr 2026', paid_date: null, payment_method: null },
  { id: 'fee_s3_may', student_id: 's3', center_id: 'f2', amount: 2500, due_date: '2026-05-10', status: 'Overdue', month_label: 'May 2026', paid_date: null, payment_method: null },

  // s4: 5 Paid
  { id: 'fee_s4_jan', student_id: 's4', center_id: 'f3', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-09', payment_method: 'UPI' },
  { id: 'fee_s4_feb', student_id: 's4', center_id: 'f3', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-10', payment_method: 'UPI' },
  { id: 'fee_s4_mar', student_id: 's4', center_id: 'f3', amount: 2500, due_date: '2026-03-10', status: 'Paid', month_label: 'Mar 2026', paid_date: '2026-03-08', payment_method: 'UPI' },
  { id: 'fee_s4_apr', student_id: 's4', center_id: 'f3', amount: 2500, due_date: '2026-04-10', status: 'Paid', month_label: 'Apr 2026', paid_date: '2026-04-09', payment_method: 'UPI' },
  { id: 'fee_s4_may', student_id: 's4', center_id: 'f3', amount: 2500, due_date: '2026-05-10', status: 'Paid', month_label: 'May 2026', paid_date: '2026-05-10', payment_method: 'UPI' },

  // s5: 4 Paid, 1 Pending
  { id: 'fee_s5_jan', student_id: 's5', center_id: 'f3', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-15', payment_method: 'Cash' },
  { id: 'fee_s5_feb', student_id: 's5', center_id: 'f3', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-14', payment_method: 'Cash' },
  { id: 'fee_s5_mar', student_id: 's5', center_id: 'f3', amount: 2500, due_date: '2026-03-10', status: 'Paid', month_label: 'Mar 2026', paid_date: '2026-03-10', payment_method: 'Cash' },
  { id: 'fee_s5_apr', student_id: 's5', center_id: 'f3', amount: 2500, due_date: '2026-04-10', status: 'Paid', month_label: 'Apr 2026', paid_date: '2026-04-11', payment_method: 'UPI' },
  { id: 'fee_s5_may', student_id: 's5', center_id: 'f3', amount: 2500, due_date: '2026-05-10', status: 'Pending', month_label: 'May 2026', paid_date: null, payment_method: null },

  // s6: 5 Paid
  { id: 'fee_s6_jan', student_id: 's6', center_id: 'f4', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-08', payment_method: 'UPI' },
  { id: 'fee_s6_feb', student_id: 's6', center_id: 'f4', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-09', payment_method: 'UPI' },
  { id: 'fee_s6_mar', student_id: 's6', center_id: 'f4', amount: 2500, due_date: '2026-03-10', status: 'Paid', month_label: 'Mar 2026', paid_date: '2026-03-09', payment_method: 'UPI' },
  { id: 'fee_s6_apr', student_id: 's6', center_id: 'f4', amount: 2500, due_date: '2026-04-10', status: 'Paid', month_label: 'Apr 2026', paid_date: '2026-04-10', payment_method: 'UPI' },
  { id: 'fee_s6_may', student_id: 's6', center_id: 'f4', amount: 2500, due_date: '2026-05-10', status: 'Paid', month_label: 'May 2026', paid_date: '2026-05-08', payment_method: 'UPI' },

  // s7: 4 Paid, 1 Pending
  { id: 'fee_s7_jan', student_id: 's7', center_id: 'f2', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-10', payment_method: 'UPI' },
  { id: 'fee_s7_feb', student_id: 's7', center_id: 'f2', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-10', payment_method: 'UPI' },
  { id: 'fee_s7_mar', student_id: 's7', center_id: 'f2', amount: 2500, due_date: '2026-03-10', status: 'Paid', month_label: 'Mar 2026', paid_date: '2026-03-09', payment_method: 'Cash' },
  { id: 'fee_s7_apr', student_id: 's7', center_id: 'f2', amount: 2500, due_date: '2026-04-10', status: 'Paid', month_label: 'Apr 2026', paid_date: '2026-04-08', payment_method: 'UPI' },
  { id: 'fee_s7_may', student_id: 's7', center_id: 'f2', amount: 2500, due_date: '2026-05-10', status: 'Pending', month_label: 'May 2026', paid_date: null, payment_method: null },

  // s8: 2 Paid, 3 Overdue
  { id: 'fee_s8_jan', student_id: 's8', center_id: 'f1', amount: 2500, due_date: '2026-01-10', status: 'Paid', month_label: 'Jan 2026', paid_date: '2026-01-10', payment_method: 'Cash' },
  { id: 'fee_s8_feb', student_id: 's8', center_id: 'f1', amount: 2500, due_date: '2026-02-10', status: 'Paid', month_label: 'Feb 2026', paid_date: '2026-02-12', payment_method: 'UPI' },
  { id: 'fee_s8_mar', student_id: 's8', center_id: 'f1', amount: 2500, due_date: '2026-03-10', status: 'Overdue', month_label: 'Mar 2026', paid_date: null, payment_method: null },
  { id: 'fee_s8_apr', student_id: 's8', center_id: 'f1', amount: 2500, due_date: '2026-04-10', status: 'Overdue', month_label: 'Apr 2026', paid_date: null, payment_method: null },
  { id: 'fee_s8_may', student_id: 's8', center_id: 'f1', amount: 2500, due_date: '2026-05-10', status: 'Overdue', month_label: 'May 2026', paid_date: null, payment_method: null }
];

const alerts = [
  { id: 'alert1', student_id: null, center_id: 'f1', type: 'Fees', severity: 'high', message: 'Metro Brain Latur City has ₹10,000 in overdue fees.', is_read: false, is_dismissed: false },
  { id: 'alert2', student_id: 's3', center_id: 'f2', type: 'Churn', severity: 'critical', message: 'Rohan Kadam is at high risk of dropping out (attendance: 65%).', is_read: false, is_dismissed: false },
  { id: 'alert3', student_id: 's8', center_id: 'f1', type: 'Attendance', severity: 'medium', message: 'Pooja More attendance has dropped to 75%.', is_read: false, is_dismissed: false },
  { id: 'alert4', student_id: 's2', center_id: 'f1', type: 'Fees', severity: 'low', message: 'Priya Patil fee for May 2026 is pending.', is_read: false, is_dismissed: false },
  { id: 'alert5', student_id: 's6', center_id: 'f4', type: 'Wins', severity: 'info', message: 'Neha Pawar scored 95% in Vedic Math test!', is_read: false, is_dismissed: false },
  { id: 'alert6', student_id: 's1', center_id: 'f1', type: 'Wins', severity: 'info', message: 'Aarav Deshmukh scored 88% in Abacus Level 1 test.', is_read: false, is_dismissed: false },
  { id: 'alert7', student_id: null, center_id: 'f3', type: 'Attendance', severity: 'medium', message: 'Average attendance at Metro Brain Ausa is below threshold (73%).', is_read: false, is_dismissed: false },
  { id: 'alert8', student_id: 's5', center_id: 'f3', type: 'Scores', severity: 'high', message: 'Amit Shinde test score dropped to 60%.', is_read: false, is_dismissed: false }
];

async function setup() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log("Connected to TimescaleDB Cloud. Creating tables...");

  await client.query(`
    CREATE TABLE IF NOT EXISTS franchises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      manager TEXT NOT NULL,
      teacher_rating NUMERIC NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      center_id TEXT NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      course TEXT NOT NULL,
      attendance_rate NUMERIC NOT NULL,
      test_score_avg NUMERIC NOT NULL,
      fee_status TEXT NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      center_id TEXT REFERENCES franchises(id) ON DELETE SET NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      center_id TEXT NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      timing TEXT NOT NULL,
      teacher_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      capacity INTEGER
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS fees (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      center_id TEXT NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
      amount NUMERIC NOT NULL,
      due_date DATE NOT NULL,
      status TEXT NOT NULL,
      month_label TEXT,
      paid_date DATE,
      payment_method TEXT
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      status TEXT NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS test_scores (
      id SERIAL PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      score NUMERIC NOT NULL,
      speed_rating NUMERIC,
      accuracy_rating NUMERIC
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
      center_id TEXT REFERENCES franchises(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT false,
      is_dismissed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Tables created successfully. Seeding data...");

  // Insert Franchises
  for (const f of franchises) {
    await client.query(
      `INSERT INTO franchises (id, name, location, manager, teacher_rating) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [f.id, f.name, f.location, f.manager, f.teacher_rating]
    );
  }

  // Insert Students
  for (const s of students) {
    await client.query(
      `INSERT INTO students (id, center_id, name, course, attendance_rate, test_score_avg, fee_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [s.id, s.center_id, s.name, s.course, s.attendance_rate, s.test_score_avg, s.fee_status]
    );
  }

  // Insert Users
  for (const u of users) {
    await client.query(
      `INSERT INTO users (id, username, password_hash, role, center_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [u.id, u.username, u.password_hash, u.role, u.center_id]
    );
  }

  // Insert Batches
  for (const b of batches) {
    await client.query(
      `INSERT INTO batches (id, center_id, name, timing, teacher_id, capacity)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.center_id, b.name, b.timing, b.teacher_id, b.capacity]
    );
  }

  // Insert Fees
  for (const fee of fees) {
    await client.query(
      `INSERT INTO fees (id, student_id, center_id, amount, due_date, status, month_label, paid_date, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [fee.id, fee.student_id, fee.center_id, fee.amount, fee.due_date, fee.status, fee.month_label, fee.paid_date, fee.payment_method]
    );
  }

  // Insert Alerts
  for (const alert of alerts) {
    await client.query(
      `INSERT INTO alerts (id, student_id, center_id, type, severity, message, is_read, is_dismissed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [alert.id, alert.student_id, alert.center_id, alert.type, alert.severity, alert.message, alert.is_read, alert.is_dismissed]
    );
  }

  console.log("Demo data successfully seeded into Tiger DB.");
  await client.end();
}

setup().catch(console.error);
