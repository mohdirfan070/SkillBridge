const express = require("express");
const router = express.Router();
const { markAttendance } = require("../controllers/attendanceController");
const { requireRole } = require("../middlewares/requireRoles");

// POST /attendance/mark — student marks own attendance
router.post("/mark", requireRole("student"), markAttendance);

module.exports = router;