const express = require("express");
const router = express.Router();

const {
  createBatch,
  generateInvite,
  joinBatch,
  getBatchSummary,
  getBatchesByTrainer,
  assignTrainersToBatch,
} = require("../controllers/batchController");

const { requireRole } = require("../middlewares/requireRoles");

// POST /batches — Trainer / Institution Admin creates a batch
router.post("/", requireRole("institution_admin"), createBatch);

// GET /batches/trainer/:id — Trainer views their own batches
router.get("/trainer/:id", requireRole("trainer"), getBatchesByTrainer);

// POST /batches/:id/invite — Trainer generates invite link
router.post("/:id/invite", requireRole("trainer"), generateInvite);

// POST /batches/:id/join — Student joins via invite link
router.post("/:id/join", requireRole("student"), joinBatch);

// POST /batches/:id/assign-trainers — Institution assigns trainers to batch
router.post("/:id/assign-trainers", requireRole("institution_admin"), assignTrainersToBatch);

// GET /batches/:id/summary — Institution views attendance summary per batch
router.get("/:id/summary", requireRole("institution_admin"), getBatchSummary);

module.exports = router;