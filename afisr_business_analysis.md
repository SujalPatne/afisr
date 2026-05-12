# AFISR — Business Strategy & Product Evolution

> Built for **Metro Brain EduCare Pvt. Ltd.** — an abacus/math franchise network

---

## 🔍 Current State (What You Have)

| Module | What it does |
|---|---|
| Dashboard | KPI overview — revenue, enrollments, teacher rating, active centers |
| Student Progress | Score, speed, accuracy charts with weak-student flagging |
| Churn Predictor | Rule-based dropout risk per student |
| Recommendations | AI-generated action items per franchise center |
| Admin Panel | Manual data entry for franchises + students |

**Honest assessment:** This is a solid internal analytics tool, but it's currently *passive* — it shows you what happened. A business system needs to be *active* — trigger actions, reduce admin work, and create direct value for parents, teachers, and franchise owners.

---

## 🏢 1. Business-Critical Features (Must-Have from a Business POV)

### 🔴 Tier 1 — Revenue & Survival

| Feature | Why it matters |
|---|---|
| **Fee Collection & Payment Tracking** | Unpaid fees = cash flow death. Right now fee status is just "Paid/Pending/Overdue" — no amounts, due dates, or collection workflow |
| **Franchise Royalty Management** | How much each franchise owes HQ, when it's due, payment history |
| **Enrollment Pipeline / Lead Management** | Inquiries → demo → enrollment funnel. Losing leads = losing revenue |
| **Certificate & Course Completion Tracking** | Metro Brain's product *is* certifications. Completions = renewals + word-of-mouth |
| **Revenue Forecasting** | Month-ahead revenue per center based on fee schedules and enrollment trends |

### 🟡 Tier 2 — Operations & Control

| Feature | Why it matters |
|---|---|
| **Multi-Level Role Access** | HQ admin sees everything. Franchise owner sees only their center. Teacher sees only their students |
| **Teacher Performance Management** | Rate teachers over time, link to student outcomes. Currently ratings are static |
| **Attendance Input & Automation** | Today attendance is a stored number — teachers need a way to mark it daily |
| **Batch / Cohort Management** | Morning/Evening batches, batch capacity, which students are in which batch |
| **Audit Trail / Data History** | Who added/changed what — critical for franchise disputes |

### 🟢 Tier 3 — Growth & Retention

| Feature | Why it matters |
|---|---|
| **Parent Portal / Communication** | Parents are the actual customers. Give them visibility into their child's progress |
| **Student Achievement & Gamification** | Badges, levels, leaderboards within a center — drives engagement and retention |
| **Franchise Comparison Benchmarking** | "Your center is 20% below network average" — motivates owners to act |
| **NPS / Feedback Collection** | Structured parent/student satisfaction surveys |

---

## 🚀 2. Beyond Franchise Management — What AFISR Can Become

Right now it's a **monitoring tool**. Here's how to make it a **growth platform**:

### 📱 → An EdTech SaaS Platform
- **Student-facing app/portal**: Let students see their own scores, badges, practice problems
- **Parent app**: Weekly progress reports, fee payment portal, notifications
- **Teacher app**: Mark attendance, upload test scores, view flagged students
- This transforms AFISR from an HQ tool to a **network-wide operating system**

### 🏆 → A Franchise Performance Marketplace
- **Franchise leaderboard**: Public ranking of top-performing centers (healthy competition)
- **Best practices sharing**: Automatically surface what top centers do differently
- **Franchise health score**: Single composite metric (revenue + attendance + scores + churn risk) for HQ to rank centers at a glance

### 🤖 → An AI-Powered Teaching Assistant
- **Personalized learning path**: Based on a student's weak areas (low speed vs low accuracy), recommend specific drills
- **Predictive test preparation**: "Students like Riya typically struggle with Module 4 — schedule extra practice"
- **Automated monthly reports**: AI writes the monthly center report for each franchise owner

### 📊 → A Business Intelligence Console for HQ
- **What-if modeling**: "If we open 5 new centers in Pune, projected revenue increase is X"
- **Churn impact calculator**: "Recovering these 12 high-risk students = ₹3.6L in retained fees"
- **Seasonal trend analysis**: Enrollment peaks/dips by month/quarter

---

## ⚙️ 3. Automation Playbook — Where to Add Automation

### 🔔 Alert & Notification Automations (Highest ROI, Lowest Effort)
| Trigger | Action | Channel |
|---|---|---|
| Student misses 3 consecutive classes | Alert franchise owner + generate follow-up task | In-app + WhatsApp/Email |
| Fee overdue > 7 days | Auto-send reminder to parent + flag on dashboard | SMS/WhatsApp |
| Churn risk crosses "High" threshold | Auto-create an "Intervention Required" task for center head | In-app notification |
| Student score drops >15 points in a month | Notify teacher + recommend remedial content | Email to teacher |
| Franchise revenue drops 20% MoM | HQ alert + auto-schedule review call | Email to HQ |
| New enrollment | Auto-generate welcome message + fee schedule | WhatsApp/Email |

### 📋 Workflow Automations
| Process | Today (Manual) | Automated Future |
|---|---|---|
| Monthly report to franchise owners | HQ manually compiles data | Auto-generated PDF report emailed on 1st of each month |
| Royalty invoice to franchises | Manual calculation + email | Auto-generated invoice based on enrolled students |
| Student progress report for parents | Never happens | Auto-sent every 4 weeks |
| Teacher rating update | Static, manual | Auto-calculated monthly from student score trends |
| Churn risk scan | On-demand only | Nightly batch job, flags appear in morning dashboard |

### 🤖 AI Automations
| Feature | How |
|---|---|
| **Auto-generate center recommendations** | Currently on-demand — run on schedule (daily/weekly) using LLM |
| **Smart fee reminder messages** | AI writes personalized reminders based on student + payment history |
| **Automated intervention scripts** | When a weak student is flagged, AI suggests a specific 2-week intervention plan |
| **Natural language query** | "Which centers are underperforming this quarter?" typed as a question, answered with data |

---

## 🎨 4. Making It Simpler & More User-Friendly

### 🧭 Navigation — Simplify the Information Architecture

**Current problem:** 5 separate pages that don't talk to each other. A franchise owner doesn't know where to start.

**Fix — Role-Based Landing Pages:**
- **HQ Admin** lands on → Network Health Dashboard (top-level KPIs + alerts)
- **Franchise Owner** lands on → My Center Dashboard (their students, their revenue, their tasks)
- **Teacher** lands on → Today's Attendance + Flagged Students

### 📊 Dashboard — Replace Tables with Stories

**Current problem:** Raw numbers in tables require the user to mentally process "is this good or bad?"

**Fix — Use Visual Hierarchy + Contextual Color:**
```
Instead of: Revenue: ₹1,24,500
Show:       ₹1,24,500  ▲ +12% vs last month  [On Track 🟢]

Instead of: Avg Score: 67
Show:       67/100  [Below Network Avg of 74 ⚠️]
```

### 🎯 Priority Inbox — Surface What Needs Attention NOW

Add a **"Today's Focus"** widget on every dashboard that shows:
1. 🔴 3 students flagged as high churn risk
2. 🟡 2 fee payments overdue since last week
3. 🟢 1 student just completed Level 3 — celebrate!

This means users don't need to navigate — the system tells them what to do.

### ✏️ Simplify Data Entry (Admin Panel)

**Current problem:** Manual form entry for every student is tedious and error-prone.

**Fixes:**
- **Bulk CSV/Excel import** — franchise owners already maintain these
- **QR code check-in** for attendance (students scan on arrival)
- **Quick-add templates** — "Add 10 students from same batch" with shared fields
- **In-line editing** — edit a cell in the table directly, not a separate form

### 📱 Make It Mobile-First

Franchise owners and teachers operate on phones, not desktops. Responsive layout alone isn't enough:
- **Thumb-friendly tap targets** (all buttons ≥ 44px)
- **Offline attendance marking** — sync when connected
- **Swipe gestures** on student cards (swipe left = dismiss, swipe right = flag)
- **Bottom navigation bar** on mobile instead of left sidebar

### 💬 Reduce Cognitive Load with Plain Language

| Current Label | Better Label |
|---|---|
| "Churn Predictor" | "Who Might Drop Out?" |
| "Franchise Insights" | "How Are My Centers Doing?" |
| "AI Recommendations" | "Action Items" |
| "Admin Data Entry" | "Manage Students & Centers" |
| "Avg. Attendance: 0.82" | "82% of students attended this month" |

---

## 🗺️ Suggested Roadmap

### Phase 1 — Solidify the Core (Next 4-6 weeks)
- [ ] Real database (PostgreSQL/Supabase) — currently in-memory = data loss on restart
- [ ] Role-based authentication (HQ vs Franchise Owner vs Teacher)
- [ ] Fee collection tracking with amounts + due dates
- [ ] Daily attendance marking interface for teachers

### Phase 2 — Add Automations (Next 2-3 months)
- [ ] WhatsApp/Email notification system for alerts
- [ ] Automated monthly report generation (PDF)
- [ ] Nightly churn risk batch job
- [ ] Fee overdue reminder workflow

### Phase 3 — Expand the Platform (3-6 months)
- [ ] Parent portal (view child's progress, pay fees)
- [ ] Student gamification (badges, levels)
- [ ] Natural language query interface for HQ
- [ ] Franchise benchmarking & leaderboard

### Phase 4 — Scale & Monetize (6+ months)
- [ ] White-label the platform for other franchise networks
- [ ] Mobile app (React Native)
- [ ] Advanced ML: personalized learning path recommendations
- [ ] API for third-party integrations (accounting software, LMS)

---

## 💡 Single Most Impactful Change You Can Make Today

> **Add a "Today's Focus" inbox** on the main dashboard that surfaces the 3-5 most critical action items across all centers — who needs a call, which fees are overdue, which student needs intervention.

This single feature transforms AFISR from a "report viewer" to a **daily operating tool** that franchise owners and HQ staff actually open every morning. Everything else builds on this habit.
