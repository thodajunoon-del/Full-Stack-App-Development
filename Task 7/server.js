const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "paravesh",
    database: "studentdb"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
    } else {
        console.log("✅ Database Connected Successfully");
        const createFeedbackTable = `
            CREATE TABLE IF NOT EXISTS task7_feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                rating INT NOT NULL,
                comments TEXT NOT NULL,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.query(createFeedbackTable, (err) => {
            if (err) console.error("Error creating feedback table:", err);
        });
    }
});

// Submit Feedback
app.post("/api/feedback", (req, res) => {
    const { name, email, rating, comments } = req.body;
    if (!name || !email || !rating || !comments) return res.status(400).json({ error: "Missing fields" });

    db.query("INSERT INTO task7_feedback (name, email, rating, comments) VALUES (?, ?, ?, ?)", [name, email, rating, comments], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

// Get Feedback
app.get("/api/feedback", (req, res) => {
    db.query("SELECT * FROM task7_feedback ORDER BY submitted_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`🚀 Task 7 Server running at http://localhost:${PORT}`);
});