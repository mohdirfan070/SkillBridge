const pool = require("../config/db");

// POST /batches
const createBatch = async (name, institution_id) => {
  const result = await pool.query(
    "INSERT INTO batches (name, institution_id) VALUES ($1,$2) RETURNING *",
    [name, institution_id]
  );
  return result.rows[0];
};

// POST /batches/:id/join — student joins via invite link
const addStudentToBatch = async (batchId, studentId) => {
  await pool.query(
    "INSERT INTO batch_students (batch_id, student_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [batchId, studentId]
  );
};

// POST /batches/:id/assign-trainers — institution assigns trainers
const assignTrainersToBatch = async (batchId, trainerIds) => {
  await pool.query("DELETE FROM batch_trainers WHERE batch_id = $1", [batchId]);
  for (const trainerId of trainerIds) {
    await pool.query(
      "INSERT INTO batch_trainers (batch_id, trainer_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [batchId, trainerId]
    );
  }
};

// GET /institutions/:id/batches — institution views their batches with assigned trainer_ids
const getBatchesByInstitution = async (institutionId) => {
  const result = await pool.query(
    `SELECT b.*, 
            COALESCE(array_agg(bt.trainer_id) FILTER (WHERE bt.trainer_id IS NOT NULL), '{}') AS trainer_ids
     FROM batches b
     LEFT JOIN batch_trainers bt ON b.id = bt.batch_id
     WHERE b.institution_id = $1
     GROUP BY b.id
     ORDER BY b.id DESC`,
    [institutionId]
  );
  return result.rows;
};

// GET /batches/trainer/:id — trainer views their own batches
const getBatchesByTrainer = async (trainerId) => {
  const result = await pool.query(
    `SELECT b.id, b.name, b.institution_id, b.created_at
     FROM batches b
     JOIN batch_trainers bt ON b.id = bt.batch_id
     WHERE bt.trainer_id = $1`,
    [trainerId]
  );
  return result.rows;
};

// GET /batches/:id/summary — institution views attendance summary per batch
const getBatchSummary = async (batchId) => {
  const result = await pool.query(
    `SELECT 
        s.id AS session_id,
        s.title,
        s.date,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END)  AS absent_count,
        SUM(CASE WHEN a.status = 'late'    THEN 1 ELSE 0 END)  AS late_count
     FROM sessions s
     LEFT JOIN attendance a ON s.id = a.session_id
     WHERE s.batch_id = $1
     GROUP BY s.id, s.title, s.date
     ORDER BY s.date ASC`,
    [batchId]
  );
  return result.rows;
};

module.exports = {
  createBatch,
  addStudentToBatch,
  assignTrainersToBatch,
  getBatchesByInstitution,
  getBatchesByTrainer,
  getBatchSummary,
};