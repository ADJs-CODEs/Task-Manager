const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUserById, getUsers } = require("../controllers/userController");

const router = express.Router();

//User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); //Get a specific user

module.exports = router;