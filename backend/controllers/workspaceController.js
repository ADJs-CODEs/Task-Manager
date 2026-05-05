const Workspace = require("../models/Workspace");
const crypto = require("crypto");
const { sendInviteEmail } = require("../config/emailService");

const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Workspace name is required" });

    const workspace = await Workspace.create({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ "members.user": req.user._id })
      .populate("createdBy", "name email");
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("members.user", "name email profileImageUrl role");

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    const isMember = workspace.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (workspace.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the workspace creator can update it" });
    }

    workspace.name = req.body.name || workspace.name;
    workspace.description = req.body.description ?? workspace.description;

    const updated = await workspace.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (workspace.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the workspace creator can delete it" });
    }

    await workspace.deleteOne();
    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const inviteAdminToWorkspace = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    const isMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    const inviteToken = crypto.randomBytes(20).toString("hex");
    workspace.inviteToken = inviteToken;
    await workspace.save();

    await sendInviteEmail({
      toEmail: email,
      inviterName: req.user.name,
      inviteToken,
      workspaceName: workspace.name,
      workspaceId: workspace._id,
    });

    res.json({ message: `Invite sent to ${email}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const joinWorkspace = async (req, res) => {
  try {
    const { inviteToken } = req.body;
    if (!inviteToken) return res.status(400).json({ message: "Invite token is required" });

    const workspace = await Workspace.findOne({ inviteToken });
    if (!workspace) return res.status(404).json({ message: "Invalid or expired invite token" });

    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) return res.status(400).json({ message: "Already a member of this workspace" });

    workspace.members.push({ user: req.user._id, role: "admin" });
    await workspace.save();

    res.json({ message: "Joined workspace successfully", workspace });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteAdminToWorkspace,
  joinWorkspace,
};