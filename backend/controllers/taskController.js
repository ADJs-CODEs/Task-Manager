const Task = require("../models/Task");
const mongoose = require("mongoose");

const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { workspaceId: req.workspaceId };
    if (status) filter.status = status;

    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo", "name email profileImageUrl"
      );
    }

    tasks = tasks.map((task) => {
      const completedCount = task.todoChecklist.filter((item) => item.completed).length;
      return { ...task._doc, completedTodoCount: completedCount };
    });

    const baseFilter = { workspaceId: req.workspaceId };
    const userFilter = req.user.role !== "admin" ? { assignedTo: req.user._id } : {};

    const allTasks = await Task.countDocuments({ ...baseFilter, ...userFilter });
    const pendingTasks = await Task.countDocuments({ ...baseFilter, ...userFilter, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ ...baseFilter, ...userFilter, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ ...baseFilter, ...userFilter, status: "Completed" });

    res.json({
      tasks,
      statusSummary: { all: allTasks, pendingTasks, inProgressTasks, completedTasks },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      workspaceId: req.workspaceId,
    }).populate("assignedTo", "name email profileImageUrl");

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      workspaceId: req.workspaceId,
      todoChecklist,
      attachments,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, workspaceId: req.workspaceId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, workspaceId: req.workspaceId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, workspaceId: req.workspaceId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => { item.completed = true; });
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findOne({ _id: req.params.id, workspaceId: req.workspaceId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update checklist" });
    }

    task.todoChecklist = todoChecklist;

    const completedCount = task.todoChecklist.filter((item) => item.completed).length;
    const totalItems = task.todoChecklist.length;
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) task.status = "Completed";
    else if (task.progress > 0) task.status = "In Progress";
    else task.status = "Pending";

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo", "name email profileImageUrl"
    );
    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const wid = new mongoose.Types.ObjectId(req.workspaceId);
    const workspaceFilter = { workspaceId: wid };

    const totalTasks = await Task.countDocuments(workspaceFilter);
    const pendingTasks = await Task.countDocuments({ ...workspaceFilter, status: "Pending" });
    const completedTasks = await Task.countDocuments({ ...workspaceFilter, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      ...workspaceFilter,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { workspaceId: wid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status.replace(/\s+/g, "")] =
        taskDistributionRaw.find((i) => i._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { workspaceId: wid } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((i) => i._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find(workspaceFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, pendingTasks, completedTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const wid = new mongoose.Types.ObjectId(req.workspaceId);
    const workspaceFilter = { workspaceId: wid, assignedTo: userId };

    const totalTasks = await Task.countDocuments(workspaceFilter);
    const pendingTasks = await Task.countDocuments({ ...workspaceFilter, status: "Pending" });
    const completedTasks = await Task.countDocuments({ ...workspaceFilter, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      ...workspaceFilter,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { workspaceId: wid, assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status.replace(/\s+/g, "")] =
        taskDistributionRaw.find((i) => i._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { workspaceId: wid, assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((i) => i._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find(workspaceFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, pendingTasks, completedTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTasks, getTaskById, createTask, updateTask,
  deleteTask, updateTaskStatus, updateTaskChecklist,
  getDashboardData, getUserDashboardData,
};