const Project = require('../models/Project');
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('createdBy','name email').populate('members','name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('createdBy','name email').populate('members','name email');
    }
    res.json(projects);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });
    const project = await Project.create({ name, description, createdBy: req.user._id, members: members || [] });
    res.status(201).json(project);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const { name, description, members } = req.body;
    if (name) project.name = name;
    if (description) project.description = description;
    if (members) project.members = members;
    const updated = await project.save();
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getProjects, createProject, updateProject, deleteProject };
