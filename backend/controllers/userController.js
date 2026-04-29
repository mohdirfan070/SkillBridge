// User Controller
// Handles request and response logic for user-related operations
const { getAuth } = require("@clerk/express");
const userModel = require("../models/userModel");

// Register user after Clerk login
const registerUser = async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, email, role ,institution_id } = req.body.data;
    // console.log({ name, email, role, userId });
    try {
        const existing = await userModel.getUserByClerkId(userId);
        if (existing) {
            return res.json(existing);
        }
        const user = await userModel.createUser(
            name,
            email,
            role,
            userId,
            institution_id
        );
        res.status(200).json(user.rows[0]);
    } catch (err) {
        // console.log(err)
        res.status(500).send(err.message);
    }
};

const getUsersByRoleAndInstitution = async (req, res) => {
  const { role, institution_id } = req.query;

  if (!role || !institution_id) {
    return res.status(400).json({ error: "role and institution_id are required" });
  }

  try {
    const result = await userModel.getUsersByRoleAndInstitution(role, institution_id);
        // console.log(result);
    res.json(result);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

const getUserDetails = async(req, res) =>{
      const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
      try {
        const user = await userModel.getUserByClerkId(userId);
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message);
    }
}


module.exports = { registerUser , getUserDetails , getUsersByRoleAndInstitution};
