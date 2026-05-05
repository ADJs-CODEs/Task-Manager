const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  createWorkspace, getMyWorkspaces, getWorkspaceById,
  updateWorkspace, deleteWorkspace, inviteAdminToWorkspace, joinWorkspace,
} = require("../controllers/workspaceController");

const router = express.Router();

router.post("/", protect, adminOnly, createWorkspace);
router.get("/", protect, adminOnly, getMyWorkspaces);
router.post("/join", protect, joinWorkspace);
router.get("/:id", protect, adminOnly, getWorkspaceById);
router.put("/:id", protect, adminOnly, updateWorkspace);
router.delete("/:id", protect, adminOnly, deleteWorkspace);
router.post("/:id/invite", protect, adminOnly, inviteAdminToWorkspace);

module.exports = router;