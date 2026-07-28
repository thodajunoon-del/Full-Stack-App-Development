const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ==========================
   DATABASE CONNECTION
========================== */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "paravesh",
    database: "studentdb"
});

db.connect((err) => {

    if (err) {

        console.log("❌ Database Connection Failed");
        console.log(err);

    } else {

        console.log("✅ Database Connected Successfully");

    }

});


/* ==========================
   DASHBOARD
========================== */

app.get("/dashboard", (req, res) => {

    const sql = "SELECT COUNT(*) AS totalStudents FROM students";

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        res.json({
            success: true,
            totalStudents: result[0].totalStudents
        });

    });

});


/* ==========================
   ADD STUDENT
========================== */

app.post("/register", (req, res) => {

    const { name, email, dob, department, phone } = req.body;

    if (!name || !email || !dob || !department || !phone) {

        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });

    }

    const sql = `

        INSERT INTO students
        (name,email,dob,department,phone)
        VALUES (?,?,?,?,?)

    `;

    db.query(

        sql,

        [name, email, dob, department, phone],

        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Registration Failed"
                });

            }

            res.json({
                success: true,
                message: "Student Registered Successfully"
            });

        }

    );

});


/* ==========================
   VIEW ALL STUDENTS
========================== */

app.get("/students", (req, res) => {

    const sql = `

        SELECT
        id,
        name,
        email,
        dob,
        department,
        phone

        FROM students

        ORDER BY id DESC

    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Unable to Fetch Students"
            });

        }

        res.json(result);

    });

});


/* ==========================
   VIEW SINGLE STUDENT
========================== */

app.get("/student/:id", (req, res) => {

    const id = req.params.id;

    db.query(

        "SELECT * FROM students WHERE id=?",

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            res.json(result);

        }

    );

});

/* ==========================
   UPDATE STUDENT
========================== */

app.put("/update/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        department,
        phone
    } = req.body;

    if (!name || !email || !department || !phone) {

        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });

    }

    const sql = `

        UPDATE students

        SET

        name=?,
        email=?,
        department=?,
        phone=?

        WHERE id=?

    `;

    db.query(

        sql,

        [
            name,
            email,
            department,
            phone,
            id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Update Failed"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Student Not Found"
                });

            }

            res.json({
                success: true,
                message: "Student Updated Successfully"
            });

        }

    );

});


/* ==========================
   DELETE STUDENT
========================== */

app.delete("/delete/:id", (req, res) => {

    const id = req.params.id;

    db.query(

        "DELETE FROM students WHERE id=?",

        [id],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Delete Failed"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Student Not Found"
                });

            }

            res.json({
                success: true,
                message: "Student Deleted Successfully"
            });

        }

    );

});


/* ==========================
   DEFAULT ROUTE
========================== */

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/index.html");

});


/* ==========================
   START SERVER
========================== */

const PORT = 3000;

app.listen(PORT, () => {

    console.log("======================================");
    console.log("🎓 Student Management System Started");
    console.log("======================================");
    console.log("✅ Database Connected");
    console.log(`🚀 Server Running at http://localhost:${PORT}`);
    console.log("======================================");

});