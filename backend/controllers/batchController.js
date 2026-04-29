const batchModel = require("../models/batchModel");

// POST /batches — Trainer / Institution Admin
const createBatch = async (req, res) => {
  const { name, institution_id } = req.body;
  try {
    const batch = await batchModel.createBatch(name, institution_id);
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /batches/:id/invite — Trainer generates invite link
const generateInvite = async (req, res) => {
  const { id } = req.params;
  const inviteLink = `${process.env.CLIENT_URL}/join-batch/${id}`; // ← THIS LINE
  res.json({ link: inviteLink });
};

// POST /batches/:id/join — Student joins via invite link
// POST /batches/:id/join — Student joins via invite link
const joinBatch = async (req, res) => {
  const { id } = req.params;
  // console.log("req.user:", req.user); // ✅ add this
  // console.log("batch id:", id);       // ✅ add this

  const student_id = req.user.id;
  try {
    await batchModel.addStudentToBatch(id, student_id);
    res.json({ message: "Joined batch successfully" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Already joined this batch" });
    }
    console.error("joinBatch error:", err); // ✅ add this
    res.status(500).json({ error: err.message });
  }
};


// POST /batches/:id/assign-trainers — Institution assigns trainers to batch
const assignTrainersToBatch = async (req, res) => {
  const { id } = req.params;
  const { trainer_ids } = req.body;
  try {
    await batchModel.assignTrainersToBatch(id, trainer_ids);
    res.json({ message: "Trainers assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /batches/:id/summary — Institution views attendance summary per batch
const getBatchSummary = async (req, res) => {
  const { id } = req.params;
  try {
    const summary = await batchModel.getBatchSummary(id);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /batches/trainer/:id — Trainer views their own batches
const getBatchesByTrainer = async (req, res) => {
  const trainerId = req.params.id;
  try {
    const batches = await batchModel.getBatchesByTrainer(trainerId);
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBatch,
  generateInvite,
  joinBatch,
  assignTrainersToBatch,
  getBatchSummary,
  getBatchesByTrainer,
};