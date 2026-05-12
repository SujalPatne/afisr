# AFISR Development Log

## Session — 12 May 2026 (Late Night)

### What we did today

Took a step back from coding and did a **full business analysis** of AFISR — looked at it not as a developer but from the perspective of someone actually running Metro Brain EduCare's franchise network.

**The honest truth:** what we've built so far is a decent analytics dashboard, but it's passive. It *shows* data — it doesn't *drive action*. A franchise owner opens it, sees numbers, and then... what? There's no workflow, no alerts, no daily reason to come back.

### Key realizations

1. **Fee tracking is the lifeline** — we store "Paid/Pending/Overdue" as text but no actual amounts, due dates, or collection workflow. Without money tracking, this isn't a business tool.
2. **Everyone sees the same thing** — HQ, franchise owners, and teachers all get the same admin view. They need completely different experiences.
3. **No parent/student facing side** — the parents are the actual paying customers and they have zero visibility.
4. **Data dies on restart** — still using in-memory storage. This is a ticking time bomb.
5. **Automations are the differentiator** — auto-alerts for missed classes, overdue fees, churn risk... this is what turns a dashboard into a daily operating tool.
6. **UX needs plain language** — "Churn Predictor" means nothing to a franchise owner. "Who Might Drop Out?" does.

### What we decided to build next

Created a phased implementation plan (see TODO.md). Starting with the foundation — persistent database, auth, fee tracking — then layering automations and the parent portal on top.

The single most impactful feature identified: a **"Today's Focus" inbox** that tells users what needs attention right now, so they don't have to hunt through pages.

### Mood

Productive session. Feels like we finally have clarity on *what* to build, not just *how* to build it.

---

## Session — 13 May 2026 (12:00 AM — continued from last night)

### What we built

Jumped straight from analysis into implementation. Got 3 major features shipped:

**1. Database Schema Evolution**
- Added 6 new tables to TimescaleDB: `users`, `batches`, `fees`, `attendance`, `test_scores`, `alerts`
- Seeded 40 fee records across 8 students (Jan–May 2026), 8 alerts, 5 batches
- Added proper indexes for all query-heavy columns
- Revenue calculations now use actual fee data instead of `students × ₹15,000` estimate

**2. Today's Focus Inbox** (THE most impactful feature)
- This is now the default landing page
- Surfaces alerts sorted by severity: critical → high → medium → low → info
- Filter tabs: All, Fees, Churn, Attendance, Scores, Wins
- Quick summary cards show counts per severity
- Mark read / dismiss actions that persist to DB
- Red badge on sidebar shows unread count

**3. Fee Collection Dashboard**
- Two views: Overview + All Records
- Overview: KPI cards (collected ₹77.5k, pending ₹7.5k, overdue ₹15k), collection-by-center stacked bar chart, payment status donut chart, overdue students table
- All Records: full table with status filters, center filters, inline "Record Payment" button
- Recording a payment instantly updates the DB and refreshes the summary

**4. UX Improvements**
- Renamed all nav items to plain language
  - "Churn Predictor" → "Who Might Drop Out?"
  - "Recommendations" → "Action Items"
  - "Admin Data Entry" → "Manage Data"
  - "Dashboard" → "Center Insights"
- Added "INTELLIGENCE SYSTEM" subtitle under AFISR logo

### What's next

Phase 1.2: Login page + role-based access. Then Phase 2.2: daily attendance marking for teachers.

---

## Session — 13 May 2026 (12:30 AM)

### What we built / fixed

Caught a potential security vector and resolved it immediately:

**1. Key Rotation & Security Hardening**
- Noticed previously hardcoded TimescaleDB connection strings in repo history.
- Formally rotated the `tsdbadmin` database password at the Cloud provider level.
- Rendered all historical credential leaks in older commits completely harmless.

**2. Environment-Driven Application Lifecycle**
- Implemented full `.env` support natively via the `dotenv` module.
- Sanitized `server.ts`, `api/index.ts`, and `db_setup.js` to decouple connection parameters from logic.
- Synchronized safe repository states to remote origin and paved way for secure Vercel runtime injection.

---
