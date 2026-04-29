const pool = require("../config/db");

// POST /attendance/mark — student marks present
const markAttendance = async (session_id, student_id, status) => {
  const result = await pool.query(
    `INSERT INTO attendance (session_id, student_id, status, marked_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (session_id, student_id) 
     DO UPDATE SET status = EXCLUDED.status, marked_at = NOW()
     RETURNING *`,
    [session_id, student_id, status]
  );
  return result.rows[0];
};

module.exports = { markAttendance };