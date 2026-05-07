// controllers/project.controller.js
import Project from "../models/Project.model.js";

/* ================= GET ALL PROJECTS (PUBLIC) ================= */
export const getProjects = async (req, res) => {
  try {
    const { sector, subCategory, category, type } = req.query;
    
    let query = { 
      isActive: true, 
      isDeleted: false
    };

    // Handle different types for frontend
    if (type === "cards") {
      query.projectType = "PROJECT CARD";
    } else if (type === "list") {
      query.projectType = "PROJECT LIST";
    } else if (category) {
      query.projectType = category;
    } else {
      // Default to cards if no type specified
      query.projectType = "PROJECT CARD";
    }

    if (sector) {
      query.sector = sector.toUpperCase();
    }
    if (subCategory) {
      query.subCategory = subCategory.toUpperCase();
    }

    // For list type, sort by serial number, for cards sort by date
    const sortOption = type === "list" ? { serialNumber: 1 } : { createdAt: -1 };
    
    const projects = await Project.find(query).sort(sortOption);
    
    res.status(200).json({
      success: true,
      data: projects,
      type: type || "cards"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ================= GET AVAILABLE SECTORS (PUBLIC) ================= */
export const getAvailableSectors = async (req, res) => {
  try {
    const sectors = await Project.distinct('sector', { 
      isActive: true, 
      isDeleted: false 
    });
    
    res.status(200).json({
      success: true,
      data: sectors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sectors" });
  }
};

/* ================= GET ALL PROJECTS (ADMIN - includes deleted) ================= */
export const getAllProjectsAdmin = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    let query = {};
    
    if (includeDeleted !== 'true') {
      query.isDeleted = false;
    }

    const projects = await Project.find(query).sort({ serialNumber: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ================= CREATE PROJECT ================= */
export const createProject = async (req, res) => {
  try {
    const { title, description, projectType, sector, subCategory, location, content, isActive, area, serialNumber } = req.body;

    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }
    
    if (!projectType) {
      return res.status(400).json({ message: "Project type is required" });
    }
    
    if (!sector) {
      return res.status(400).json({ message: "Project sector is required" });
    }
    
    if (!location) {
      return res.status(400).json({ message: "Project location is required" });
    }

    // Image is now optional - if no image, use default or null

    let finalSerialNumber = serialNumber ? parseInt(serialNumber) : 0;

    // Auto-generate serial number for Project List entries (where area is provided)
    if (area && !finalSerialNumber) {
      const lastProject = await Project.findOne({ 
        area: { $exists: true, $ne: null },
        isDeleted: false 
      }).sort({ serialNumber: -1 });
      finalSerialNumber = lastProject ? lastProject.serialNumber + 1 : 1;
    }

    const projectData = {
      title: title.trim(),
      description: description ? description.trim() : "",
      projectType: projectType.trim().toUpperCase(),
      sector: sector.trim().toUpperCase(),
      subCategory: subCategory ? subCategory.trim().toUpperCase() : "",
      location: location.trim(),
      content: content ? content.trim() : "",
      area: area ? area.trim() : "",
      serialNumber: finalSerialNumber,
      isActive: isActive === 'true' || isActive === true,
      // Disk storage mein file ka path req.files mein available hota hai
      image: req.files && req.files.image && req.files.image[0] 
        ? `/uploads/${req.files.image[0].filename}` 
        : null,
    };

    // Optional file upload
    if (req.files && req.files.file && req.files.file[0]) {
      projectData.file = `/uploads/${req.files.file[0].filename}`;
    }

    console.log("Project data to create:", projectData);

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create project",
      error: error.message 
    });
  }
};

/* ================= UPDATE PROJECT ================= */
export const updateProject = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      sector: req.body.sector,
      subCategory: req.body.subCategory,
      location: req.body.location,
      content: req.body.content,
      area: req.body.area,
      serialNumber: req.body.serialNumber ? parseInt(req.body.serialNumber) : 0,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    };

    if (req.files && req.files.image && req.files.image[0]) {
      updateData.image = req.files.image[0].location;
    }

    if (req.files && req.files.file && req.files.file[0]) {
      updateData.file = req.files.file[0].location;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
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

/* ================= SOFT DELETE PROJECT ================= */
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ success: true, message: "Project soft deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

/* ================= RESTORE PROJECT ================= */
export const restoreProject = async (req, res) => {
  try {
    const restored = await Project.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restored) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ success: true, message: "Project restored", project: restored });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to restore project" });
  }
};

/* ================= PERMANENT DELETE PROJECT ================= */
export const permanentDeleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ success: true, message: "Project permanently deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
