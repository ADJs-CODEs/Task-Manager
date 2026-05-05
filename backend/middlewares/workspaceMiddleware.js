const Workspace = require("../models/Workspace");

const resolveWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.headers["x-workspace-id"];
    if (!workspaceId) {
      return res.status(400).json({ message: "No workspace selected" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    req.workspace = workspace;
    req.workspaceId = workspaceId;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { resolveWorkspace };