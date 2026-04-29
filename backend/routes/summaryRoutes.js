const express = require("express");
const router = express.Router();

const {
  getBatchSummary,
  getInstitutionSummary,
  getProgrammeSummary,
} = require("../controllers/summaryController");

const { requireRole } = require("../middlewares/requireRoles");

// 🟢 Institution Admin → Batch summary
router.get(
  "/batches/:id/summary",
  requireRole("institution_admin"),
  getBatchSummary
);


// 🟣 Programme Manager + Monitoring Officer → Institution summary
router.get(
  "/institutions/:id/summary",
  requireRole("programme_manager", "monitoring_officer"),
  getInstitutionSummary
);

// 🔴 Programme summary (GLOBAL)
router.get(
  "/programme/summary",
  requireRole("programme_manager", "monitoring_officer"),
  getProgrammeSummary
);

module.exports = router;