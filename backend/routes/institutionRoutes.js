const express = require("express");
const router = express.Router();
const {
  createInstitution,
  getAllInstitutions,
  getBatchesByInstitution,
  getInstitutionSummary,
  getProgrammeSummary,
} = require("../controllers/instituionController");
const { requireRole } = require("../middlewares/requireRoles");

router.post("/", requireRole("institution_admin"), createInstitution);
router.get("/", getAllInstitutions);
router.get("/programme/summary", requireRole("programme_manager", "monitoring_officer"), getProgrammeSummary); 
router.get("/:id/batches", requireRole("institution_admin"), getBatchesByInstitution);
router.get("/:id/summary", requireRole("programme_manager","monitoring_officer"), getInstitutionSummary);

module.exports = router;