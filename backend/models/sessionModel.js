const db = require("../config/db");

const createSession = async (batch_id, trainer_id, title, date, start_time, end_time) => {
  const result = await db.query(
    `INSERT INTO sessions (batch_id, trainer_id, title, date, start_time, end_time)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [batch_id, trainer_id, title, date, start_time, end_time]
  );
  return result.rows[0];
};

// Student → sessions from their joined batches
const getSessionsByStudent = async (studentId) => {
  const result = await db.query(
    `SELECT s.*, 
            b.name AS batch_name,
            u.name AS trainer_name,
            a.status AS attendance_status  -- ✅ this must exist
     FROM sessions s
     JOIN batch_students bs ON s.batch_id = bs.batch_id
     JOIN batches b ON s.batch_id = b.id
     JOIN users u ON s.trainer_id = u.id
     LEFT JOIN attendance a ON a.session_id = s.id AND a.student_id = $1
     WHERE bs.student_id = $1
     ORDER BY s.date DESC`,
    [studentId]
  );
  return result.rows;
};

// Trainer → sessions they created
const getSessionsByTrainer = async (trainerId) => {
  const result = await db.query(
    `SELECT s.*, b.name AS batch_name
     FROM sessions s
     JOIN batches b ON s.batch_id = b.id
     WHERE s.trainer_id = $1
     ORDER BY s.date DESC`,
    [trainerId]
  );
  return result.rows;
};

// Trainer → attendance for a session
const getSessionAttendance = async (sessionId) => {
  const result = await db.query(
    `SELECT a.*, u.name
     FROM attendance a
     JOIN users u ON a.student_id = u.id
     WHERE a.session_id = $1`,
    [sessionId]
  );
  return result.rows;
};

module.exports = {
  createSession,
  getSessionsByStudent,
  getSessionsByTrainer,
  getSessionAttendance,
};