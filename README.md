# SkillBridge – FullStack Attendance & Batch Management System

This project is a role-based attendance and batch management system. It’s built with **React (frontend)**, **Express.js (backend)**, and **PostgreSQL** for the database. Authentication is handled by **Clerk**, and I’ve tried to enforce strict role-based access control across all routes.

---

## Live URLs
- Frontend: https://skillbridge-self-six.vercel.app  
- Backend: https://skillbridge-pcr3.onrender.com  
- API Base: `https://skillbridge-pcr3.onrender.com/api`

---

## Test Accounts
Here are some demo accounts you can use to check out the different dashboards:

| Role                | Username             | Password   |
|---------------------|----------------------|------------|
| Institution Admin   | institution1         | 9538321498 |
| Trainer             | trainer1             | 9538321498 |
| Student             | student1             | 9538321498 |
| Programme Manager   | programmemanager1    | 9538321498 |
| Monitoring Officer  | monitoringofficer1   | 9538321498 |

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or above)
- PostgreSQL (v14 or above)
- npm

### Steps to run locally
1. Clone the repo:
   ```bash
   git clone https://github.com/mohdirfan070/SkillBridge.git
Backend setup:

bash
cd backend
npm install
cp .env.example .env
Fill in:

PORT

CLIENT_URL

DATABASE_URL

CLERK_PUBLISHABLE_KEY

CLERK_SECRET_KEY

Then run:

bash
npm run dev
Frontend setup:

bash
cd frontend
npm install
cp .env.example .env
Fill in:

VITE_CLERK_PUBLISHABLE_KEY

VITE_BACKEND_URL

Then run:

bash
npm run dev
Database:

sql
CREATE DATABASE skillbridge;
Run the schema from database.sql or use your migration tool.

Schema Decisions
Users: single table with a role field (student, trainer, institution_admin, programme_manager, monitoring_officer).

Institutions: created by admins.

Batches: linked to institutions, many-to-many with trainers and students.

Sessions: linked to batches, created by trainers.

Attendance: unique (session_id, student_id) constraint so each student can only mark once per session.

This setup keeps things simple and enforces least privilege.

Tech Stack
Frontend: React + Clerk for auth, Axios for API calls, TailwindCSS for styling.

Backend: Express.js, PostgreSQL, pg library.

Auth: Clerk middleware validates tokens.

I went with Postgres because joins and summaries are easier to handle compared to NoSQL. Tailwind was chosen just to speed up UI work.

Project Status
Fully working:

Role-based dashboards (Student, Trainer, Institution Admin, Programme Manager, Monitoring Officer).

Invite link flow for joining batches/sessions.

Attendance marking with time-based button logic.

Institution and programme summaries.

Partially done:

Late attendance marking (logic is stubbed but not finished).

Monitoring Officer dashboard (basic summary only, no drill-down).

Skipped:

Email notifications.

Analytics (charts, graphs).

CI/CD pipeline.

Reflection
If I had more time, I’d add real-time updates with WebSockets so trainers and admins don’t have to refresh to see attendance changes. That would make the system feel more dynamic and collaborative.