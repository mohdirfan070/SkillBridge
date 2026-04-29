// middleware/requireRole.js
const { getAuth } = require("@clerk/express");
const userModel = require("../models/userModel");

function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Look up user in DB by Clerk ID
      const user = await userModel.getUserByClerkId(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      req.user = user; // attach user to request
      next();
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

module.exports = {requireRole};
