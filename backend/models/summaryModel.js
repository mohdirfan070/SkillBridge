const pool = require("../config/db");

// 🟢 BATCH SUMMARY
const getBatchSummary =async (batchId) => {
  const result = await pool.query(
    `SELECT 
        s.id as session_id,
        s.title,
        COUNT(a.id) as total_marked,
        COUNT(*) FILTER (WHERE a.status = 'present') as present,
        COUNT(*) FILTER (WHERE a.status = 'absent') as absent,
        COUNT(*) FILTER (WHERE a.status = 'late') as late
     FROM sessions s
     LEFT JOIN attendance a ON s.id = a.session_id
     WHERE s.batch_id = $1
     GROUP BY s.id`,
    [batchId]
  );
  return result.rows[0];
};

// 🟣 INSTITUTION SUMMARY
const getInstitutionSummary = async(institutionId) => {
  const result = await pool.query(
    `SELECT 
        b.id as batch_id,
        b.name,
        COUNT(a.id) as total_marked,
        COUNT(*) FILTER (WHERE a.status = 'present') as present,
        COUNT(*) FILTER (WHERE a.status = 'absent') as absent,
        COUNT(*) FILTER (WHERE a.status = 'late') as late
     FROM batches b
     LEFT JOIN sessions s ON b.id = s.batch_id
     LEFT JOIN attendance a ON s.id = a.session_id
     WHERE b.institution_id = $1
     GROUP BY b.id`,
    [institutionId]
  );
  return result.rows[0];
};

// 🔴 PROGRAMME SUMMARY (REQUIRED FOR ASSIGNMENT)
const getProgrammeSummary = () => {
  return pool.query(
    `SELECT 
        COUNT(DISTINCT b.institution_id) as total_institutions,
        COUNT(DISTINCT b.id) as total_batches,
        COUNT(DISTINCT s.id) as total_sessions,
        COUNT(a.id) as total_attendance,
        COUNT(*) FILTER (WHERE a.status = 'present') as present
     FROM batches b
     LEFT JOIN sessions s ON b.id = s.batch_id
     LEFT JOIN attendance a ON s.id = a.session_id`
  );
};

module.exports = {
  getBatchSummary,
  getInstitutionSummary,
  getProgrammeSummary,
};