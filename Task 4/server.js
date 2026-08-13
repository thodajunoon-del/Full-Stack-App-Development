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
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Note: We use studentdb but we create customers, products, orders specific to this task.
    // In a real app we might have a separate DB or avoid naming collisions.
    const createCustomers = `
        CREATE TABLE IF NOT EXISTS task4_customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL
        )
    `;
    const createProducts = `
        CREATE TABLE IF NOT EXISTS task4_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL
        )
    `;
    const createOrders = `
        CREATE TABLE IF NOT EXISTS task4_orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL,
            order_date DATE NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES task4_customers(id),
            FOREIGN KEY (product_id) REFERENCES task4_products(id)
        )
    `;

    db.query(createCustomers, (err) => {
        if (err) console.error("Error creating customers:", err);
        db.query(createProducts, (err) => {
            if (err) console.error("Error creating products:", err);
            db.query(createOrders, (err) => {
                if (err) console.error("Error creating orders:", err);
                insertDummyData();
            });
        });
    });
}

function insertDummyData() {
    db.query("SELECT COUNT(*) AS count FROM task4_customers", (err, result) => {
        if (!err && result[0].count === 0) {
            // Insert Customers
            db.query("INSERT INTO task4_customers (name, email) VALUES ('Alice Smith', 'alice@example.com'), ('Bob Johnson', 'bob@example.com'), ('Charlie Brown', 'charlie@example.com')");
            // Insert Products
            db.query("INSERT INTO task4_products (name, price) VALUES ('Laptop', 999.99), ('Smartphone', 599.50), ('Headphones', 149.00)");
            
            // Insert Orders (give it a bit of time to ensure customers/products exist, or just run query sequentially)
            setTimeout(() => {
                const insertOrders = `
                    INSERT INTO task4_orders (customer_id, product_id, quantity, total_amount, order_date) VALUES 
                    (1, 1, 1, 999.99, '2023-10-01'),
                    (1, 3, 2, 298.00, '2023-10-05'),
                    (2, 2, 1, 599.50, '2023-10-10'),
                    (3, 1, 2, 1999.98, '2023-10-15'),
                    (2, 3, 1, 149.00, '2023-10-20')
                `;
                db.query(insertOrders, () => console.log("✅ Dummy data inserted for Task 4"));
            }, 500);
        }
    });
}

// ==========================
// API ENDPOINTS (TASK 4 LOGIC)
// ==========================

// 1. Customer Order History using JOINs
app.get("/api/history", (req, res) => {
    const query = `
        SELECT 
            o.id AS order_id,
            c.name AS customer_name,
            p.name AS product_name,
            o.quantity,
            o.total_amount,
            o.order_date
        FROM task4_orders o
        JOIN task4_customers c ON o.customer_id = c.id
        JOIN task4_products p ON o.product_id = p.id
        ORDER BY o.order_date DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Statistics using Subqueries
app.get("/api/stats", (req, res) => {
    // Highest value order using a subquery
    const highestValueQuery = `
        SELECT o.id, o.total_amount, (SELECT name FROM task4_customers WHERE id = o.customer_id) as customer_name
        FROM task4_orders o 
        WHERE total_amount = (SELECT MAX(total_amount) FROM task4_orders)
        LIMIT 1
    `;
    
    // Most active customer using a subquery and joins
    // Subquery: SELECT customer_id FROM task4_orders GROUP BY customer_id ORDER BY COUNT(*) DESC LIMIT 1
    const mostActiveQuery = `
        SELECT c.name, 
               (SELECT COUNT(*) FROM task4_orders WHERE customer_id = c.id) as order_count
        FROM task4_customers c
        WHERE c.id = (
            SELECT customer_id 
            FROM task4_orders 
            GROUP BY customer_id 
            ORDER BY COUNT(id) DESC 
            LIMIT 1
        )
    `;

    db.query(highestValueQuery, (err, highestResults) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.query(mostActiveQuery, (err, activeResults) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                highestOrder: highestResults[0] || null,
                mostActiveCustomer: activeResults[0] || null
            });
        });
    });
});

// 3. Get Customers
app.get("/api/customers", (req, res) => {
    db.query("SELECT id, name FROM task4_customers", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Get Products
app.get("/api/products", (req, res) => {
    db.query("SELECT id, name, price FROM task4_products", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create Customer
app.post("/api/customers", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    
    // Generate a dummy email for the new customer to satisfy NOT NULL constraint
    const email = name.toLowerCase().replace(/\s+/g, '') + "@example.com";
    
    db.query("INSERT INTO task4_customers (name, email) VALUES (?, ?)", [name, email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId, name: name });
    });
});

// Create Product
app.post("/api/products", (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Name and price are required" });
    
    db.query("INSERT INTO task4_products (name, price) VALUES (?, ?)", [name, price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId, name: name, price: price });
    });
});

// 5. Create Order
app.post("/api/orders", (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    
    if (!customer_id || !product_id || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Get product price
    db.query("SELECT price FROM task4_products WHERE id = ?", [product_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Product not found" });

        const price = results[0].price;
        const total_amount = price * quantity;
        const order_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const insertQuery = "INSERT INTO task4_orders (customer_id, product_id, quantity, total_amount, order_date) VALUES (?, ?, ?, ?, ?)";
        
        db.query(insertQuery, [customer_id, product_id, quantity, total_amount, order_date], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: "Order placed successfully!" });
        });
    });
});

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`🚀 Task 4 Server running at http://localhost:${PORT}`);
});
