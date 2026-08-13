const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "paravesh",
    database: "studentdb",
    multipleStatements: true // Required to run triggers and views easily
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
    } else {
        console.log("✅ Database Connected Successfully");
        
        // Setup schema: Tables, Triggers, Views
        const schemaSetup = `
            CREATE TABLE IF NOT EXISTS task6_employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                position VARCHAR(100) NOT NULL,
                salary DECIMAL(10,2) NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS task6_audit_log (
                id INT AUTO_INCREMENT PRIMARY KEY,
                action VARCHAR(50) NOT NULL,
                record_id INT NOT NULL,
                log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            DROP TRIGGER IF EXISTS after_employee_insert;
            CREATE TRIGGER after_employee_insert
            AFTER INSERT ON task6_employees
            FOR EACH ROW
            BEGIN
                INSERT INTO task6_audit_log (action, record_id) VALUES ('INSERT', NEW.id);
            END;

            DROP TRIGGER IF EXISTS after_employee_update;
            CREATE TRIGGER after_employee_update
            AFTER UPDATE ON task6_employees
            FOR EACH ROW
            BEGIN
                INSERT INTO task6_audit_log (action, record_id) VALUES ('UPDATE', NEW.id);
            END;
            
            CREATE OR REPLACE VIEW task6_daily_activity AS
            SELECT 
                DATE(log_time) as activity_date,
                COUNT(*) as total_actions,
                SUM(CASE WHEN action = 'INSERT' THEN 1 ELSE 0 END) as inserts,
                SUM(CASE WHEN action = 'UPDATE' THEN 1 ELSE 0 END) as updates
            FROM task6_audit_log
            GROUP BY DATE(log_time)
            ORDER BY activity_date DESC;
        `;
        
        db.query(schemaSetup, (err) => {
            if (err) console.error("Error setting up schema:", err);
            else console.log("✅ Tables, Triggers, and Views initialized");
        });
    }
});

// APIs

// 1. Add Employee (Fires INSERT Trigger)
app.post("/api/employees", (req, res) => {
    const { name, position, salary } = req.body;
    if (!name || !position || !salary) return res.status(400).json({ error: "Missing fields" });
    
    db.query("INSERT INTO task6_employees (name, position, salary) VALUES (?, ?, ?)", [name, position, salary], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

// 2. Update Employee Salary (Fires UPDATE Trigger)
app.put("/api/employees/:id", (req, res) => {
    const { id } = req.params;
    const { salary } = req.body;
    if (!salary) return res.status(400).json({ error: "Salary required" });
    
    db.query("UPDATE task6_employees SET salary = ? WHERE id = ?", [salary, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// 3. Get Employees (for dropdowns/UI)
app.get("/api/employees", (req, res) => {
    db.query("SELECT * FROM task6_employees ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Get Raw Audit Log
app.get("/api/audit-log", (req, res) => {
    db.query("SELECT * FROM task6_audit_log ORDER BY log_time DESC LIMIT 50", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. Get Daily Activity Report (From View)
app.get("/api/daily-report", (req, res) => {
    db.query("SELECT * FROM task6_daily_activity LIMIT 10", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

const PORT = 3006;
app.listen(PORT, () => {
    console.log(`🚀 Task 6 Server running at http://localhost:${PORT}`);
});
