const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { resolveWorkspace } = require("../middlewares/workspaceMiddleware");
const { getUserById, getUsers, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", protect, adminOnly, resolveWorkspace, getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, adminOnly, resolveWorkspace, deleteUser);

module.exports = router;