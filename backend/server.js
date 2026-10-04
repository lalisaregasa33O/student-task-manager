const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Task = require("./models/Task");
const validateTaskTitle = require("./utils/taskValidation");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// ROUTES
// =========================

// Home route
app.get("/", (req, res) => {
    res.send("Student Task Manager Backend");
});


// =========================
// GET ALL TASKS
// =========================

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();

        res.json(tasks);

    } catch (error) {
        console.log("GET error:", error);

        res.status(500).json({
            message: "Failed to load tasks."
        });
    }
});


// =========================
// CREATE A TASK
// =========================

// CREATE A TASK
app.post("/api/tasks", async (req, res) => {
    try {
        const { title, priority } = req.body;

        // Validate title
        const validationError = validateTaskTitle(title);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        // Validate priority
        const allowedPriorities = ["low", "medium", "high"];

        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Priority must be low, medium, or high."
            });
        }

        const cleanTitle = title.trim();

        const task = await Task.create({
            title: cleanTitle,
            priority: priority
        });

        res.status(201).json(task);

    } catch (error) {
        console.log("POST error:", error);

        res.status(500).json({
            message: "Failed to create task."
        });
    }
});


// =========================
// UPDATE A TASK
// =========================

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { title, completed } = req.body;

        // Validate title
        const validationError = validateTaskTitle(title);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        // Validate completed
        if (typeof completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be true or false."
            });
        }

        // Remove unnecessary spaces
        const cleanTitle = title.trim();

        // Update task
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: cleanTitle,
                completed: completed
            },
            {
                new: true
            }
        );

        // Task doesn't exist
        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json(task);

    } catch (error) {
        console.log("PUT error:", error);

        res.status(500).json({
            message: "Failed to update task."
        });
    }
});


// =========================
// DELETE A TASK
// =========================

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(
            req.params.id
        );

        // Task doesn't exist
        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task deleted successfully."
        });

    } catch (error) {
        console.log("DELETE error:", error);

        res.status(400).json({
            message: "Invalid task ID."
        });
    }
});


// =========================
// START SERVER
// =========================

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });

    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
}

startServer();