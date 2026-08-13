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
    password: "password123", // I need to verify the password used in previous tasks. It was "paravesh" in Task 1/3/4. Let me double check my previous tasks' passwords if possible. Wait, in the transcript grep for Task 1 server, the password was "paravesh". Let me use "paravesh".
    database: "studentdb"
});

// Reconnect with correct password
db.config.password = "paravesh";

db.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
    } else {
        console.log("✅ Database Connected Successfully");
        
        // Create Tables
        const createStudentsTable = `
            CREATE TABLE IF NOT EXISTS task5_students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                department VARCHAR(100) NOT NULL,
                score INT NOT NULL
            )
        `;
        
        const createPurchasesTable = `
            CREATE TABLE IF NOT EXISTS task5_purchases (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                amount DECIMAL(10,2) NOT NULL,
                purchase_date DATE NOT NULL,
                FOREIGN KEY (student_id) REFERENCES task5_students(id) ON DELETE CASCADE
            )
        `;
        
        const createBankAccounts = `
            CREATE TABLE IF NOT EXISTS task5_bank_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                balance DECIMAL(10,2) NOT NULL
            )
        `;
        
        const createMerchantAccounts = `
            CREATE TABLE IF NOT EXISTS task5_merchant_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                balance DECIMAL(10,2) NOT NULL
            )
        `;
        
        db.query(createStudentsTable, (err) => {
            if (err) console.error("Error creating students table:", err);
            else {
                db.query(createPurchasesTable, (err) => {
                    if (err) console.error("Error creating purchases table:", err);
                    else {
                        // Insert dummy data if empty
                        db.query("SELECT COUNT(*) AS count FROM task5_students", (err, result) => {
                            if (!err && result[0].count === 0) {
                                const insertStudents = `INSERT INTO task5_students (name, department, score) VALUES 
                                    ('Alice Smith', 'Computer Science', 95),
                                    ('Bob Johnson', 'Mathematics', 82),
                                    ('Charlie Brown', 'Computer Science', 78),
                                    ('Diana Prince', 'Physics', 91)`;
                                
                                db.query(insertStudents, (err) => {
                                    if (!err) {
                                        const insertPurchases = `INSERT INTO task5_purchases (student_id, amount, purchase_date) VALUES 
                                            (1, 1500.00, '2023-10-01'),
                                            (1, 300.50, '2023-10-15'),
                                            (2, 450.00, '2023-11-02'),
                                            (3, 2000.00, '2023-11-10'),
                                            (4, 850.75, '2023-12-01')`;
                                        db.query(insertPurchases, () => {
                                            console.log("✅ Dummy data inserted for Task 5");
                                            
                                            // Insert Payment dummy data
                                            db.query(createBankAccounts, () => {
                                                db.query(createMerchantAccounts, () => {
                                                    db.query("SELECT COUNT(*) AS c FROM task5_bank_accounts", (err, res) => {
                                                        if (!err && res[0].c === 0) {
                                                            db.query("INSERT INTO task5_bank_accounts (name, balance) VALUES ('User Wallet', 5000.00)");
                                                            db.query("INSERT INTO task5_merchant_accounts (name, balance) VALUES ('University Merchant', 0.00)");
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    }
                                });
                            } else {
                                // Tables exist, make sure payment tables do too
                                db.query(createBankAccounts, () => {
                                    db.query(createMerchantAccounts, () => {
                                        db.query("SELECT COUNT(*) AS c FROM task5_bank_accounts", (err, res) => {
                                            if (!err && res[0].c === 0) {
                                                db.query("INSERT INTO task5_bank_accounts (name, balance) VALUES ('User Wallet', 5000.00)");
                                                db.query("INSERT INTO task5_merchant_accounts (name, balance) VALUES ('University Merchant', 0.00)");
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

// APIs

// 1. Add Student
app.post("/api/students", (req, res) => {
    const { name, department, score } = req.body;
    if (!name || !department || score === undefined) return res.status(400).json({ error: "Missing fields" });
    
    db.query("INSERT INTO task5_students (name, department, score) VALUES (?, ?, ?)", [name, department, score], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

// 2. Add Purchase
app.post("/api/purchases", (req, res) => {
    const { student_id, amount } = req.body;
    if (!student_id || !amount) return res.status(400).json({ error: "Missing fields" });
    
    const purchase_date = new Date().toISOString().split('T')[0];
    db.query("INSERT INTO task5_purchases (student_id, amount, purchase_date) VALUES (?, ?, ?)", [student_id, amount, purchase_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// 3. Get all students (for dropdown)
app.get("/api/students", (req, res) => {
    db.query("SELECT id, name FROM task5_students", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Analytics: Total Revenue by Department (GROUP BY)
app.get("/api/revenue-by-dept", (req, res) => {
    const query = `
        SELECT s.department, SUM(p.amount) AS total_revenue
        FROM task5_students s
        JOIN task5_purchases p ON s.id = p.student_id
        GROUP BY s.department
        ORDER BY total_revenue DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. Analytics: Above Average Spenders (Subquery & HAVING)
app.get("/api/above-average-spenders", (req, res) => {
    const query = `
        SELECT s.name, SUM(p.amount) AS total_spent
        FROM task5_students s
        JOIN task5_purchases p ON s.id = p.student_id
        GROUP BY s.id, s.name
        HAVING total_spent > (
            SELECT AVG(total_amount)
            FROM (
                SELECT SUM(amount) AS total_amount
                FROM task5_purchases
                GROUP BY student_id
            ) AS avg_spent
        )
        ORDER BY total_spent DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 6. Analytics: Complete Report
app.get("/api/complete-report", (req, res) => {
    const query = `
        SELECT s.name, s.department, s.score, COALESCE(SUM(p.amount), 0) AS total_spent
        FROM task5_students s
        LEFT JOIN task5_purchases p ON s.id = p.student_id
        GROUP BY s.id, s.name, s.department, s.score
        ORDER BY total_spent DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 7. Get Balances for Simulation
app.get("/api/balances", (req, res) => {
    db.query("SELECT * FROM task5_bank_accounts WHERE id = 1", (err, user) => {
        db.query("SELECT * FROM task5_merchant_accounts WHERE id = 1", (err, merchant) => {
            res.json({
                user: user[0],
                merchant: merchant[0]
            });
        });
    });
});

// 8. Process Payment with COMMIT / ROLLBACK
app.post("/api/transfer", (req, res) => {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.query("UPDATE task5_bank_accounts SET balance = balance - ? WHERE id = 1", [amount], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Deduction failed" }));
            
            db.query("SELECT balance FROM task5_bank_accounts WHERE id = 1", (err, rows) => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Verification failed" }));
                
                if (rows[0].balance < 0) {
                    return db.rollback(() => {
                        res.json({ success: false, action: "ROLLBACK", message: "Insufficient funds. Transaction rolled back." });
                    });
                }
                
                db.query("UPDATE task5_merchant_accounts SET balance = balance + ? WHERE id = 1", [amount], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: "Merchant addition failed" }));
                    
                    db.commit((err) => {
                        if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
                        res.json({ success: true, action: "COMMIT", message: "Payment successful. Transaction committed." });
                    });
                });
            });
        });
    });
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`🚀 Task 5 Server running at http://localhost:${PORT}`);
});
