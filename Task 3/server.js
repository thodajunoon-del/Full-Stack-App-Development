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
    password: "paravesh", // Based on Task 1 DB settings
    database: "studentdb"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
    } else {
        console.log("✅ Database Connected Successfully");
        
        // Initialize users table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL
            )
        `;
        db.query(createTableQuery, (err) => {
            if (err) console.error("Error creating users table:", err);
            else {
                // Insert a dummy user if table is empty
                db.query("SELECT COUNT(*) AS count FROM users", (err, result) => {
                    if (!err && result[0].count === 0) {
                        const insertDummy = `INSERT INTO users (username, password) VALUES ('admin', 'password123')`;
                        db.query(insertDummy, () => {
                            console.log("✅ Dummy user created: admin / password123");
                        });
                    }
                });
            }
        });
    }
});

// Login Endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        if (results.length > 0) {
            res.json({ success: true, message: "Login successful!" });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password." });
        }
    });
});
// Register Endpoint
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    // Check if user already exists
    const checkQuery = "SELECT * FROM users WHERE username = ?";
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: "Username already exists." });
        }

        // Insert new user
        const insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(insertQuery, [username, password], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Failed to create account." });
            }
            res.json({ success: true, message: "Account created successfully! You can now log in." });
        });
    });
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`🚀 Task 3 Login Server running at http://localhost:${PORT}`);
});
