
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");

async function initializeDatabase() {

    // Connect to the SQLite database
    const db = await open({
        filename: path.join(__dirname, "students.db"),
        driver: sqlite3.Database
    });

    // Create students table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            semester INTEGER NOT NULL,
            email TEXT NOT NULL
        )
    `);

    // Check whether records already exist
    const result = await db.get(
        "SELECT COUNT(*) AS count FROM students"
    );

    // Insert sample records only if table is empty
    if (result.count === 0) {

        const students = [
            ["Aisha", "CSE", 6, "aisha@example.com"],
            ["Rahul", "IT", 5, "rahul@example.com"],
            ["Zain", "CSE", 7, "zain@example.com"],
            ["Priya", "ECE", 6, "priya@example.com"],
            ["Arman", "CSE", 5, "arman@example.com"],
            ["Sara", "IT", 7, "sara@example.com"],
            ["Kabir", "ECE", 5, "kabir@example.com"],
            ["Fatima", "CSE", 6, "fatima@example.com"]
        ];

        for (const student of students) {
            await db.run(
                `INSERT INTO students
                (name, department, semester, email)
                VALUES (?, ?, ?, ?)`,
                student
            );
        }
    }

    console.log("Database initialized successfully!");

    return db;
}

module.exports = initializeDatabase;
