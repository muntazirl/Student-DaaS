
const express = require("express");
const initializeDatabase = require("./init_db");

const app = express();
app.use(express.json());

let db;

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Student Data as a Service",
        service: "Student DaaS API",
        endpoints: [
            "/api/students",
            "/api/students/1",
            "/api/students?department=CSE",
            "/api/students?semester=6"
        ]
    });
});

// Health check route
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "Student DaaS API"
    });
});

// Get all students and filter students
app.get("/api/students", async (req, res) => {
    try {
        const department = req.query.department;
        const semester = req.query.semester;

        let query = "SELECT * FROM students WHERE 1=1";
        let parameters = [];

        if (department) {
            query += " AND department = ?";
            parameters.push(department.trim().toUpperCase());
        }

        if (semester !== undefined) {
            const semesterNumber = Number(semester);

            if (!Number.isInteger(semesterNumber) || semesterNumber < 1) {
                return res.status(400).json({
                    error: "Invalid semester value"
                });
            }

            query += " AND semester = ?";
            parameters.push(semesterNumber);
        }

        const students = await db.all(query, parameters);

        res.json({
            count: students.length,
            students: students
        });

    } catch (error) {
        res.status(500).json({
            error: "Unable to retrieve students"
        });
    }
});

// Get individual student by ID
app.get("/api/students/:id", async (req, res) => {
    try {
        const studentId = Number(req.params.id);

        if (!Number.isInteger(studentId) || studentId < 1) {
            return res.status(400).json({
                error: "Invalid student ID"
            });
        }

        const student = await db.get(
            "SELECT * FROM students WHERE id = ?",
            [studentId]
        );

        if (!student) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({
            error: "Unable to retrieve student"
        });
    }
});

// Start server
async function startServer() {
    try {
        db = await initializeDatabase();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Student DaaS API running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Application startup failed:", error);
        process.exit(1);
    }
}

startServer();
