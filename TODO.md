# AFISR — Implementation TODO

> Priority order: Foundation → Core Business → Automations → Platform Expansion
> Each item should be a single PR-sized chunk of work.

---

## Phase 1 — Foundation (Week 1-2)

### 1.1 Persistent Database
- [x] Set up PostgreSQL (TimescaleDB Cloud — service `bfcl9opdwz`)
- [x] Create schema: `franchises`, `students`, `fees`, `attendance`, `test_scores`, `users`, `alerts`, `batches`
- [x] Migrate from in-memory arrays to real DB queries
- [x] Seed script with realistic data (40 fee records, 8 alerts, 5 batches)

### 1.2 Authentication & Role-Based Access
- [x] User model with roles: `hq_admin`, `franchise_owner`, `teacher` (DB table created)
- [ ] Login page
- [ ] Role-based route protection
- [ ] Each franchise_owner linked to their center(s)
- [ ] Each teacher linked to their center

### 1.3 Fee Collection Module
- [x] Fee schema: amount, due_date, paid_date, student_id, status, payment_method
- [x] Fee dashboard: who owes what, total outstanding, collection rate
- [x] Add/record payment UI (inline "Record Payment" button per fee)
- [x] Fee history per student (filterable records view)
- [x] Monthly fee summary per center (collection by center chart)

---

## Phase 2 — Daily Operating Tool (Week 3-4)

### 2.1 "Today's Focus" Inbox
- [x] Backend: aggregate top alerts (churn risk, overdue fees, attendance drops, score drops)
- [x] Frontend: priority-sorted card list on main dashboard
- [x] Action buttons: "Mark Read", "Dismiss" (with severity-based styling)
- [x] Badge count in sidebar nav (red badge with count)

### 2.2 Attendance System
- [ ] Daily attendance marking UI for teachers (checklist per batch)
- [ ] Attendance calendar view per student
- [ ] Auto-flag: 3 consecutive absences → alert
- [ ] Attendance trend chart on student profile

### 2.3 Batch/Cohort Management
- [ ] Batch model: name, timing, center_id, capacity, teacher_id
- [ ] Assign students to batches
- [ ] View batch schedule per center
- [ ] Batch-level performance metrics

---

## Phase 3 — Automations (Week 5-6)

### 3.1 Notification Engine
- [ ] Notification model: type, recipient, channel, status, created_at
- [ ] In-app notification bell with dropdown
- [ ] Email integration (SendGrid/Resend)
- [ ] WhatsApp integration (Twilio/WhatsApp Business API)

### 3.2 Automated Alerts
- [ ] Fee overdue > 7 days → parent reminder (email/WhatsApp)
- [ ] 3 missed classes → franchise owner alert
- [ ] Churn risk HIGH → create intervention task
- [ ] Score drop > 15pts → teacher notification
- [ ] Revenue drop 20% MoM → HQ alert

### 3.3 Scheduled Reports
- [ ] Monthly center report: auto-generated PDF
- [ ] Email to franchise owners on 1st of each month
- [ ] Weekly student progress summary for parents
- [ ] Nightly churn risk batch scan

---

## Phase 4 — Platform Expansion (Month 2-3)

### 4.1 Parent Portal
- [ ] Parent login (linked to their child/children)
- [ ] View child's progress, scores, attendance
- [ ] Pay fees online
- [ ] Receive notifications

### 4.2 Student Gamification
- [ ] Achievement/badge system (speed medals, accuracy stars, streak badges)
- [ ] Level progression tied to course modules
- [ ] Center-level leaderboard (opt-in)
- [ ] Certificate generation on course completion

### 4.3 Franchise Benchmarking
- [ ] Network-wide averages for all KPIs
- [ ] Center performance vs network average comparison
- [ ] Franchise leaderboard (anonymized or opt-in)
- [ ] "What top centers do differently" AI insights

### 4.4 UX Overhaul
- [ ] Role-based landing pages
- [ ] Plain language labels throughout
- [ ] Mobile-first responsive redesign
- [ ] Bulk CSV import for students
- [ ] In-line table editing

---

## Phase 5 — Intelligence Layer (Month 3+)

### 5.1 Advanced AI
- [ ] Natural language query: "Which centers are struggling this month?"
- [ ] Personalized learning path per student
- [ ] Revenue forecasting per center
- [ ] What-if modeling for expansion

### 5.2 Integrations
- [ ] Accounting software (Tally/Zoho Books)
- [ ] Google Sheets sync for franchise owners
- [ ] LMS integration for course content

### 5.3 Scale
- [ ] White-label for other franchise networks
- [ ] React Native mobile app
- [ ] Multi-tenant architecture

---

## Currently Working On

> **Phase 1.2 — Authentication & Role-Based Access** (login page + route protection)

## Completed
- ✅ Phase 1.1 — Persistent Database (TimescaleDB Cloud)
- ✅ Phase 1.3 — Fee Collection Module (dashboard + records + payments)
- ✅ Phase 2.1 — Today's Focus Inbox (alerts with severity, filters, dismiss)
- ✅ UX: Plain language nav labels ("Who Might Drop Out?" etc.)
- ✅ UX: Today's Focus as default landing page

---
