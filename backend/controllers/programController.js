const programmeModel = require("../models/programmeModel");

const getProgrammeSummary = async (req, res) => {
  try {
    const summary = await programmeModel.getProgrammeSummary();
    res.json(summary.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProgrammeSummary };
