const pool = require("../config/db");
const { getAuth } = require("@clerk/express");

const getUserByClerkId = async (clerkId) => {
     const res = await pool.query("SELECT * FROM users WHERE clerk_id = $1", [clerkId]);
    return res.rows[0];

};

// Fetch users by role and institution
const getUsersByRoleAndInstitution = async (role, institutionId) => {
    const result = await pool.query(
        `SELECT id, clerk_id, name, email, role, institution_id
     FROM users
     WHERE role = $1 AND institution_id = $2`,
        [role, institutionId]
    );
    return result.rows; // ✅ return only rows, not the whole result object
};



const createUser = async (name, email, role, clerkId , institution_id) => {
    return pool.query(
        "INSERT INTO users (name, email, role, clerk_id , institution_id) VALUES ($1, $2, $3, $4 , $5) RETURNING *",
        [name, email, role, clerkId , institution_id]
    );
};

module.exports = { getUserByClerkId , createUser , getUsersByRoleAndInstitution };
