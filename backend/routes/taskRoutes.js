const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { resolveWorkspace } = require("../middlewares/workspaceMiddleware");
const {
  getDashboardData, getUserDashboardData, getTasks, getTaskById,
  createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist,
  saveTaskNote, reactToTaskNote,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/dashboard-data", protect, resolveWorkspace, getDashboardData);
router.get("/user-dashboard-data", protect, resolveWorkspace, getUserDashboardData);
router.get("/", protect, resolveWorkspace, getTasks);
router.get("/:id", protect, resolveWorkspace, getTaskById);
router.post("/", protect, adminOnly, resolveWorkspace, createTask);
router.put("/:id", protect, resolveWorkspace, updateTask);
router.delete("/:id", protect, adminOnly, resolveWorkspace, deleteTask);
router.put("/:id/status", protect, resolveWorkspace, updateTaskStatus);
router.put("/:id/todo", protect, resolveWorkspace, updateTaskChecklist);
router.put("/:id/note", protect, adminOnly, resolveWorkspace, saveTaskNote);
router.post("/:id/react", protect, resolveWorkspace, reactToTaskNote);

module.exports = router;