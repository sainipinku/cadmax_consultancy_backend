// controllers/project.controller.js
import Project from "../models/Project.model.js";

/* ================= GET ALL PROJECTS ================= */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ================= CREATE PROJECT ================= */
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
      image: req.file.path, // 🌥️ Cloudinary URL
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

/* ================= UPDATE PROJECT ================= */
export const updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path; // 🌥️ Cloudinary URL
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update project" });
  }
};

/* ================= DELETE PROJECT ================= */
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
