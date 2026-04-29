const summaryModel = require("../models/summaryModel");

// 🟢 BATCH SUMMARY
const getBatchSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await summaryModel.getBatchSummary(id);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟣 INSTITUTION SUMMARY
const getInstitutionSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await summaryModel.getInstitutionSummary(id);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔴 PROGRAMME SUMMARY
const getProgrammeSummary = async (req, res) => {
  try {
    const result = await summaryModel.getProgrammeSummary();
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBatchSummary,
  getInstitutionSummary,
  getProgrammeSummary,
};