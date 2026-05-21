# AFISR Database Entity-Relationship (ER) Diagram

This document contains the Entity-Relationship diagram and detailed schema descriptions for the **Franchise Intelligence System (AFISR)**. The database is hosted on **TimescaleDB Cloud** (PostgreSQL-compatible) and supports operational task tracking, fee records, student telemetry, and multi-tenant scoping (HQ vs. Franchise Center vs. Teacher).

---

## 📊 Entity-Relationship Diagram

The diagram below represents the tables, key attributes, and relationship cardinalities within the AFISR system:

```mermaid
erDiagram
    FRANCHISES {
        text id PK
        text name "NOT NULL"
        text location "NOT NULL"
        text manager "NOT NULL"
        numeric teacher_rating "NOT NULL"
    }

    STUDENTS {
        text id PK
        text center_id FK "REFERENCES franchises(id) ON DELETE CASCADE"
        text name "NOT NULL"
        text course "NOT NULL"
        numeric attendance_rate "NOT NULL"
        numeric test_score_avg "NOT NULL"
        text fee_status "NOT NULL"
    }

    USERS {
        text id PK
        text username "NOT NULL, UNIQUE"
        text password_hash "NOT NULL"
        text role "NOT NULL ('hq_admin', 'franchise_owner', 'teacher')"
        text center_id FK "NULLABLE, REFERENCES franchises(id)"
    }

    BATCHES {
        text id PK
        text center_id FK "REFERENCES franchises(id)"
        text name "NOT NULL"
        text timing "NOT NULL"
        text teacher_id FK "REFERENCES users(id)"
        integer capacity
    }

    FEES {
        text id PK
        text student_id FK "REFERENCES students(id) ON DELETE CASCADE"
        text center_id FK "REFERENCES franchises(id) ON DELETE CASCADE"
        numeric amount "NOT NULL"
        date due_date "NOT NULL"
        text status "NOT NULL ('Paid', 'Pending', 'Overdue')"
        text month_label
        date paid_date "NULLABLE"
        text payment_method "NULLABLE"
    }

    ATTENDANCE {
        serial id PK
        text student_id FK "REFERENCES students(id) ON DELETE CASCADE"
        text batch_id FK "REFERENCES batches(id)"
        date date "NOT NULL"
        text status "NOT NULL ('Present', 'Absent')"
    }

    TEST_SCORES {
        serial id PK
        text student_id FK "REFERENCES students(id) ON DELETE CASCADE"
        text batch_id FK "REFERENCES batches(id)"
        date date "NOT NULL"
        numeric score "NOT NULL"
        numeric speed_rating
        numeric accuracy_rating
    }

    ALERTS {
        text id PK
        text student_id FK "NULLABLE, REFERENCES students(id) ON DELETE CASCADE"
        text center_id FK "NULLABLE, REFERENCES franchises(id) ON DELETE CASCADE"
        text type "NOT NULL ('Fees', 'Churn', 'Attendance', 'Scores', 'Wins')"
        text severity "NOT NULL ('critical', 'high', 'medium', 'low', 'info')"
        text message "NOT NULL"
        boolean is_read "NOT NULL DEFAULT false"
        boolean is_dismissed "NOT NULL DEFAULT false"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    FRANCHISES ||--o{ STUDENTS : "hosts"
    FRANCHISES ||--o{ BATCHES : "manages"
    FRANCHISES ||--o{ USERS : "scopes"
    FRANCHISES ||--o{ FEES : "collects"
    FRANCHISES ||--o{ ALERTS : "triggers"

    STUDENTS ||--o{ FEES : "billed_by"
    STUDENTS ||--o{ ATTENDANCE : "marks_presence"
    STUDENTS ||--o{ TEST_SCORES : "records_performance"
    STUDENTS ||--o{ ALERTS : "subject_of"

    USERS ||--o{ BATCHES : "teaches"
    BATCHES ||--o{ ATTENDANCE : "scheduled_in"
    BATCHES ||--o{ TEST_SCORES : "graded_in"
```

---

## 📋 Schema Specifications

### 1. `franchises`
Represents the centers/franchises belonging to Metro Brain EduCare.
*   `id` (`text`): Primary key (e.g., `f1`, `f2`).
*   `name` (`text`): Name of the center.
*   `location` (`text`): Geographical city/area.
*   `manager` (`text`): Name of the franchise manager.
*   `teacher_rating` (`numeric`): Average rating of teachers in that center.

### 2. `students`
Represents individual students enrolled at centers.
*   `id` (`text`): Primary key (e.g., `s1`, `s2`).
*   `center_id` (`text`): Foreign key referencing `franchises.id`.
*   `name` (`text`): Full name of the student.
*   `course` (`text`): Target program (e.g., `Abacus Level 1`, `Vedic Math`).
*   `attendance_rate` (`numeric`): Rolling attendance percentage.
*   `test_score_avg` (`numeric`): Rolling academic test score average.
*   `fee_status` (`text`): General payment status indicator (`Paid`, `Pending`, `Overdue`).

### 3. `users`
System accounts for authentication and access control scoping.
*   `id` (`text`): Primary key.
*   `username` (`text`): Unique handle.
*   `password_hash` (`text`): Securely hashed password.
*   `role` (`text`): Role name (`hq_admin` has broad access; `franchise_owner` and `teacher` are limited by `center_id`).
*   `center_id` (`text`): Nullable foreign key referencing `franchises.id`. Scopes user access.

### 4. `batches`
Cohorts/classes schedule setups.
*   `id` (`text`): Primary key.
*   `center_id` (`text`): Foreign key referencing `franchises.id`.
*   `name` (`text`): Batch label (e.g., `Batch A`, `Evening Advanced`).
*   `timing` (`text`): Class timings.
*   `teacher_id` (`text`): Foreign key referencing `users.id` (users with role `teacher`).
*   `capacity` (`integer`): Max seat count.

### 5. `fees`
Ledger of monthly invoices and collections.
*   `id` (`text`): Primary key.
*   `student_id` (`text`): Foreign key referencing `students.id`.
*   `center_id` (`text`): Foreign key referencing `franchises.id`.
*   `amount` (`numeric`): Fee due amount.
*   `due_date` (`date`): Deadline date.
*   `status` (`text`): Standing (`Paid`, `Pending`, `Overdue`).
*   `month_label` (`text`): Targeted period string (e.g. `Jan 2026`).
*   `paid_date` (`date`): Date of collection.
*   `payment_method` (`text`): Collection mode (e.g., `Cash`, `UPI`, `Card`).

### 6. `attendance`
Session attendance ledger.
*   `id` (`serial`): Auto-incrementing primary key.
*   `student_id` (`text`): Foreign key referencing `students.id`.
*   `batch_id` (`text`): Foreign key referencing `batches.id`.
*   `date` (`date`): Date of the session.
*   `status` (`text`): Marked presence (`Present`, `Absent`).

### 7. `test_scores`
Individual test result tracking.
*   `id` (`serial`): Auto-incrementing primary key.
*   `student_id` (`text`): Foreign key referencing `students.id`.
*   `batch_id` (`text`): Foreign key referencing `batches.id`.
*   `date` (`date`): Examination date.
*   `score` (`numeric`): Earned marks.
*   `speed_rating` (`numeric`): Telemetry tracking speed.
*   `accuracy_rating` (`numeric`): Telemetry tracking accuracy.

### 8. `alerts`
Notification objects powering the *Today's Focus* inbox.
*   `id` (`text`): Primary key.
*   `student_id` (`text`): Nullable foreign key referencing `students.id`.
*   `center_id` (`text`): Nullable foreign key referencing `franchises.id`.
*   `type` (`text`): Event group (`Fees`, `Churn`, `Attendance`, `Scores`, `Wins`).
*   `severity` (`text`): Attention weight (`critical`, `high`, `medium`, `low`, `info`).
*   `message` (`text`): Alert details text.
*   `is_read` (`boolean`): Badge status flag.
*   `is_dismissed` (`boolean`): Active inbox visibility filter.
*   `created_at` (`timestamp`): Generation timestamp.
