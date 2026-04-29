const pool = require("../config/db");

// POST /institutions
const createInstitution = async (name) => {
  const result = await pool.query(
    `INSERT INTO institutions (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
};

// GET /institutions
const getAllInstitutions = async () => {
  const result = await pool.query(`SELECT * FROM institutions ORDER BY name ASC`);
  return result.rows;
};

// GET /institutions/:id/batches — includes trainer_ids for the modify panel
const getBatchesByInstitution = async (institutionId) => {
  const result = await pool.query(
    `SELECT b.id, b.name, b.institution_id, b.created_at,
            COALESCE(array_agg(bt.trainer_id) FILTER (WHERE bt.trainer_id IS NOT NULL), '{}') AS trainer_ids
     FROM batches b
     LEFT JOIN batch_trainers bt ON b.id = bt.batch_id
     WHERE b.institution_id = $1
     GROUP BY b.id
     ORDER BY b.created_at DESC`,
    [institutionId]
  );
  return result.rows;
};

// GET /institutions/:id/summary — PM views all batches in an institution
const getInstitutionSummary = async (institutionId) => {
  const result = await pool.query(
    `SELECT 
        b.id AS batch_id,
        b.name AS batch_name,
        COUNT(DISTINCT bs.student_id) AS total_students,
        COUNT(DISTINCT s.id) AS total_sessions,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS total_present,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS total_absent
     FROM batches b
     LEFT JOIN batch_students bs ON b.id = bs.batch_id
     LEFT JOIN sessions s ON b.id = s.batch_id
     LEFT JOIN attendance a ON s.id = a.session_id
     WHERE b.institution_id = $1
     GROUP BY b.id, b.name
     ORDER BY b.name ASC`,
    [institutionId]
  );
  return result.rows;
};

// GET /programme/summary — PM/MO views everything
const getProgrammeSummary = async () => {
  const result = await pool.query(
    `SELECT 
        i.id AS institution_id,
        i.name AS institution_name,
        COUNT(DISTINCT b.id) AS total_batches,
        COUNT(DISTINCT bs.student_id) AS total_students,
        COUNT(DISTINCT s.id) AS total_sessions,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS total_present,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS total_absent
     FROM institutions i
     LEFT JOIN batches b ON i.id = b.institution_id
     LEFT JOIN batch_students bs ON b.id = bs.batch_id
     LEFT JOIN sessions s ON b.id = s.batch_id
     LEFT JOIN attendance a ON s.id = a.session_id
     GROUP BY i.id, i.name
     ORDER BY i.name ASC`
  );
  return result.rows;
};

module.exports = {
  createInstitution,
  getAllInstitutions,
  getBatchesByInstitution,
  getInstitutionSummary,
  getProgrammeSummary,
};