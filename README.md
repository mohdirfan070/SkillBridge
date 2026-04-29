# 📘 SKillBridge FullStack Attendance & Batch Management System

A role-based attendance and batch management platform built with **React (frontend)**, **Express.js (backend)**, and **PostgreSQL (database)**. Authentication is powered by **Clerk**, with strict role-based access control enforced across all routes.

---

## 🔗 Live URLs
- **Frontend (React + Vite)**: https://skillbridge-self-six.vercel.app  
- **Backend (Express + Postgres)**: https://skillbridge-pcr3.onrender.com  
- **API Base URL**: `https://skillbridge-pcr3.onrender.com/api`

---

## 👥 Test Accounts
Use these credentials to log in and test each role:

| Role                | username               | Password   |
|---------------------|------------------------|------------|
| Institution Admin   | institution1           | 9538321498 |
| Trainer             | trainer1               | 9538321498 |
| Student             | student1               | 9538321498 |
| Programme Manager   | programmemanager1      | 9538321498 |
| Monitoring Officer  | monitoringofficer1     | 9538321498 |

---

## Setup Instructions

### Prerequisites
- Node.js (>= 18)
- PostgreSQL (>= 14)
- npm 

### Steps
1. **Clone the repo**
   git clone https://github.com/mohdirfan070/SkillBridge.git
   

Backend Setup

bash
cd backend
npm install
cp .env
PORT 
CLIENT_URL 
DATABASE_URL 
CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
npm run dev


Frontend Setup

bash
cd frontend
npm install
cp .env
VITE_CLERK_PUBLISHABLE_KEY
VITE_BACKEND_URL

npm run dev


Database Migration

sql
CREATE DATABASE attendance_db;
-- Run schema.sql or use migration tool
🗂 Schema Decisions defined in the **database.sql** 
Users Table: single table with role field (student, trainer, institution_admin, programme_manager, monitoring_officer).

Institutions Table: each institution created by an admin.

Batches Table: linked to institution, many‑to‑many with trainers and students via batch_trainers and batch_students.

Sessions Table: linked to batch, created by trainers.

Attendance Table: unique (session_id, student_id) constraint ensures one record per student per session.

👉 This design enforces least privilege and clean separation of responsibilities.

🛠 Stack Choices
Frontend: React + Clerk for auth, Axios for API calls, TailwindCSS for UI.

Backend: Express.js, PostgreSQL, pg library.

Auth: Clerk tokens validated in middleware.

Why Postgres: strong relational integrity, easier joins for summaries.

Why Tailwind: rapid UI prototyping, consistent design system.

✅ Project Status
Fully Working:

Role-based dashboards (Student, Trainer, Institution Admin, Programme Manager, Monitoring Officer).

Invite link flows for batch/session joining.

Attendance marking with time-based button logic.

Institution and programme summaries.

Partially Done:

Late attendance marking (logic stubbed, not fully implemented).

Monitoring Officer dashboard (basic summary only, no drill-down).

Skipped:

Email notifications.

Advanced analytics (charts, graphs).

Deployment CI/CD pipeline.

🔮 Reflection
With more time, I’d implement real-time updates via WebSockets so attendance and session changes reflect instantly across dashboards without manual refresh. This would make the system feel more dynamic and collaborative.