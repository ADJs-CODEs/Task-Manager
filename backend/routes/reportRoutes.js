const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { resolveWorkspace } = require("../middlewares/workspaceMiddleware");
const { exportUsersReport, exportTaskReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, resolveWorkspace, exportTaskReport);
router.get("/export/users", protect, adminOnly, resolveWorkspace, exportUsersReport);

module.exports = router;