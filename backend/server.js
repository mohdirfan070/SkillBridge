require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const { clerkMiddleware } = require("@clerk/express");

// CORS + BODY PARSER
app.use(
    cors({
        origin:["https://skillbridge-self-six.vercel.app","http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB CONNECTION
const pool = require("./config/db");

pool.query("SELECT NOW()")
    .then(() => console.log(" DB connected"))
    .catch((err) => console.error("DB error:", err));


// APPLY CLERK TO ALL API ROUTES (BEST PRACTICE)
app.use("/api", clerkMiddleware());


//  HEALTH CHECK
app.get("/", (req, res) => {
    res.json({ message: "Express server is running " });
});


// ================= ROUTES =================

//  USERS
app.use("/api/users", require("./routes/userRoutes"));

//  BATCHES
app.use("/api/batches", require("./routes/batchRoutes"));

//  SESSIONS
app.use("/api/sessions", require("./routes/sessionRoutes"));

//  ATTENDANCE
app.use("/api/attendance", require("./routes/attendanceRoutes"));

//  INSTITUTIONS  
app.use("/api/institutions", require("./routes/institutionRoutes"));

// SUMMARY 
app.use("/api", require("./routes/summaryRoutes"));


// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});