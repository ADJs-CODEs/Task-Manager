const Task = require("../models/Task");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const jwt = require("jsonwebtoken");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const getUsers = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.workspaceId).populate(
      "members.user", "-password"
    );
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    const members = workspace.members
      .filter((m) => m.role === "member")
      .map((m) => m.user);

    const usersWithTaskCounts = await Promise.all(
      members.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id, status: "Pending", workspaceId: req.workspaceId,
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id, status: "In Progress", workspaceId: req.workspaceId,
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id, status: "Completed", workspaceId: req.workspaceId,
        });
        return { ...user._doc, pendingTasks, inProgressTasks, completedTasks };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== req.params.id
    );
    await workspace.save();

    res.json({ message: "User removed from workspace successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };