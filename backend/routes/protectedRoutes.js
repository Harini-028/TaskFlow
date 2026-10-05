const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email createdAt");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Unable to load profile" });
    }
});

router.put("/profile", protect, async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim().toLowerCase();
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        const duplicate = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (duplicate) {
            return res.status(409).json({ message: "Email is already in use" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select("name email createdAt");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Unable to update profile" });
    }
});

module.exports = router;