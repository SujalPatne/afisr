import { Client } from 'pg';

const connectionString = 'postgresql://tsdbadmin:fkg5r0atfl1dun5e@bfcl9opdwz.ikysjdfisk.tsdb.cloud.timescale.com:32129/tsdb';

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

async function setup() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

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

  console.log("Tables created successfully.");

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

  console.log("Dummy data fed into Tiger DB.");
  await client.end();
}

setup().catch(console.error);
