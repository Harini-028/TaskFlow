const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: req.user.id
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL TASKS
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// UPDATE TASK
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const { title, description, status, priority, dueDate } = req.body;

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.status = status ?? task.status;
        task.priority = priority ?? task.priority;
        task.dueDate = dueDate ?? task.dueDate;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};