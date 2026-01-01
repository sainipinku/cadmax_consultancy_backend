// controllers/project.controller.js
import Project from "../models/Project.model.js";


// GET ALL PROJECTS (WEB + ADMIN)

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};


// CREATE PROJECT (ADMIN)

export const createProject = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Project image is required" });
    }

    const project = await Project.create({
      title,
      description,
      category,
      image: `/uploads/projects/${req.file.filename}`,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};


// UPDATE PROJECT

export const updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/projects/${req.file.filename}`;
    }

    await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
};


// DELETE PROJECT

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
};
