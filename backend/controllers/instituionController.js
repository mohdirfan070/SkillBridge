const institutionModel = require("../models/institutionModel");

const createInstitution = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  try {
    const institution = await institutionModel.createInstitution(name);
    res.status(201).json(institution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllInstitutions = async (req, res) => {
  try {
    const institutions = await institutionModel.getAllInstitutions();
    res.json(institutions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBatchesByInstitution = async (req, res) => {
  const { id } = req.params;
  try {
    const batches = await institutionModel.getBatchesByInstitution(id);
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /institutions/:id/summary 
const getInstitutionSummary = async (req, res) => {
  // console.log("working")
  const { id } = req.params;
  try {
    const summary = await institutionModel.getInstitutionSummary(id);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /programme/summary 
const getProgrammeSummary = async (req, res) => {
  try {
    const summary = await institutionModel.getProgrammeSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createInstitution,
  getAllInstitutions,
  getBatchesByInstitution,
  getInstitutionSummary,
  getProgrammeSummary,
};