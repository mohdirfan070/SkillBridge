const attendanceModel = require("../models/attendanceModel");
const pool = require("../config/db");

const markAttendance = async (req, res) => {
  const { session_id, status } = req.body;
  const student_id = req.user.id;

  if (!session_id || !status) {
    return res.status(400).json({ error: "session_id and status are required" });
  }

  if (!["present", "absent"].includes(status)) {
    return res.status(400).json({ error: "status must be present or absent" });
  }

  try {
    const session = await pool.query(
      `SELECT (date + end_time) < NOW() AS expired FROM sessions WHERE id = $1`,
      [session_id]
    );

    if (!session.rows[0]) {
      return res.status(404).json({ error: "Session not found" });
    }

    // ✅ only block present after session ends — absent is always allowed
    if (session.rows[0].expired && status === "present") {
      return res.status(400).json({ error: "Session has already ended" });
    }

    const record = await attendanceModel.markAttendance(session_id, student_id, status);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { markAttendance };