const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  createWorkspace, getMyWorkspaces, getWorkspaceById,
  updateWorkspace, deleteWorkspace, inviteAdminToWorkspace,
  joinWorkspace, addMemberToWorkspace,
  getMemberNote, saveMemberNote,
} = require("../controllers/workspaceController");

const router = express.Router();

router.post("/", protect, adminOnly, createWorkspace);
router.get("/", protect, adminOnly, getMyWorkspaces);
router.post("/join", protect, joinWorkspace);
router.get("/:id", protect, adminOnly, getWorkspaceById);
router.put("/:id", protect, adminOnly, updateWorkspace);
router.delete("/:id", protect, adminOnly, deleteWorkspace);
router.post("/:id/invite", protect, adminOnly, inviteAdminToWorkspace);
router.post("/:id/members", protect, adminOnly, addMemberToWorkspace);
router.get("/:id/notes/:userId", protect, adminOnly, getMemberNote);
router.post("/:id/notes/:userId", protect, adminOnly, saveMemberNote);

module.exports = router;