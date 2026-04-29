const express = require("express");
const router = express.Router();

const { createSession, getSessions, getSessionAttendance } = require("../controllers/sessionController");
const { requireRole } = require("../middlewares/requireRoles");

// POST /sessions — Trainer creates a session
router.post("/", requireRole("trainer"), createSession);

// GET /sessions/my — Student or Trainer views their own sessions (static route first)
router.get("/my", requireRole("student", "trainer"), getSessions);

// GET /sessions/:id/attendance — Trainer views attendance for a session
router.get("/:id/attendance", requireRole("trainer"), getSessionAttendance);

module.exports = router;