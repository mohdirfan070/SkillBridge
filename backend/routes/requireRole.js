// const router = require("express").Router();
// const requireRole = require("../middleware/requireRole");

// // Batches
// router.post("/batches", requireRole("trainer", "institution_admin"), createBatch);
// router.post("/batches/:id/invite", requireRole("trainer"), generateInvite);
// router.post("/batches/:id/join", requireRole("student"), joinBatch);
// router.get("/batches/:id/summary", requireRole("institution_admin"), getBatchSummary);

// // Sessions
// router.post("/sessions", requireRole("trainer"), createSession);
// router.get("/sessions/:id/attendance", requireRole("trainer"), getSessionAttendance);

// // Attendance
// router.post("/attendance/mark", requireRole("student"), markAttendance);

// // Institution & Programme summaries
// router.get("/institutions/:id/summary", requireRole("programme_manager"), getInstitutionSummary);
// router.get("/programme/summary", requireRole("programme_manager", "monitoring_officer"), getProgrammeSummary);

// module.exports = router;
