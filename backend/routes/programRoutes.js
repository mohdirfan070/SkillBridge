const express = require("express");
const router = express.Router();
const { getProgrammeSummary } = require("../controllers/programmeController");
const {requireRole} = require("../middlewares/requireRoles");


router.get("/programme/summary", requireRole("programme_manager", "monitoring_officer"), getProgrammeSummary);


module.exports = router;
