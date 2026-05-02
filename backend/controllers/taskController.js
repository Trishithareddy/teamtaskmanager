const Task = require('../models/Task');
const getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find(filter).populate('assignedTo','name email').populate('createdBy','name email').populate('project','name');
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo','name email').populate('createdBy','name email').populate('project','name');
    }
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Title and project are required' });
    const task = await Task.create({ title, description, project, assignedTo, dueDate, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role === 'member') {
      if (task.assignedTo.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
      if (req.body.status) task.status = req.body.status;
    } else {
      const { title, description, assignedTo, status, dueDate } = req.body;
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo) task.assignedTo = assignedTo;
      if (status) task.status = status;
      if (dueDate) task.dueDate = dueDate;
    }
    const updated = await task.save();
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const getDashboard = async (req, res) => {
  try {
    const all = await Task.find().populate('assignedTo','name').populate('project','name');
    const now = new Date();
    const stats = {
      total: all.length,
      todo: all.filter(t => t.status === 'todo').length,
      inProgress: all.filter(t => t.status === 'in-progress').length,
      completed: all.filter(t => t.status === 'completed').length,
      overdue: all.filter(t => t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < now).length,
      tasks: all
    };
    res.json(stats);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getTasks, createTask, updateTask, deleteTask, getDashboard };
