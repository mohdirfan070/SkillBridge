// User Routes
// Defines all endpoints related to users

const express = require("express");
const router = express.Router();
const {requireRole } = require("../middlewares/requireRoles");
const { registerUser , getUserDetails} = require("../controllers/userController");
const { getUsersByRoleAndInstitution } = require("../controllers/userController");
// Route to register user after Clerk login
router.post("/register", registerUser);
router.get("/me", getUserDetails);
router.get("/", requireRole("institution_admin", "programme_manager"), getUsersByRoleAndInstitution);

module.exports = router;

