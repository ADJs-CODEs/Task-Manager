const Task = require("../models/Task");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


//desc Get all users (Admin only)
//@route GET /api/users/
//@access Private (Admin)
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'member' }).select("-password");

    //Add task counts to each user
    const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
      const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "pending" });
      const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" })
      const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });
      return {
        ...user._doc, //Include all existing user data
        pendingTasks,
        inProgressTasks,
        completedTasks,
      };
    }))

    res.json(usersWithTaskCounts)

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//@desc Get user by Id
//@route GET /api/users/:id
//@access private(Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
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

    //Update User Profile 

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
    console.error("Update user error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { getUsers, getUserById, updateUser, deleteUser }