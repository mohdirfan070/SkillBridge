const sessionModel = require("../models/sessionModel");

// POST /sessions — Trainer creates a session
const createSession = async (req, res) => {
  const { batch_id, title, date, start_time, end_time } = req.body;

  if (!batch_id || !title || !date || !start_time || !end_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const trainer_id = req.user.id;

  try {
    const session = await sessionModel.createSession(batch_id, trainer_id, title, date, start_time, end_time);
    res.json(session); // ✅ model returns rows[0] directly
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /sessions/my — Student or Trainer views their sessions
const getSessions = async (req, res) => {
  const user = req.user;
  try {
    if (user.role === "student") {
      const sessions = await sessionModel.getSessionsByStudent(user.id);
      return res.json(sessions); // ✅ model returns rows directly
    }
    if (user.role === "trainer") {
      const sessions = await sessionModel.getSessionsByTrainer(user.id);
      return res.json(sessions); // ✅ model returns rows directly
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /sessions/:id/attendance — Trainer views attendance for a session
const getSessionAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await sessionModel.getSessionAttendance(id);
    res.json(attendance); // ✅ model returns rows directly
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createSession, getSessions, getSessionAttendance };