// controllers/project.controller.js
import Project from "../models/Project.model.js";
import s3 from "../config/s3.js";

const getUploadedProjectImages = (files = {}) =>
  [...(files.image || []), ...(files.images || [])].map((file) => ({
    url: file.location,
    key: file.key,
  }));

const getProjectImageKeys = (project) =>
  new Set([project.image?.key, ...(project.images || []).map((image) => image.key)].filter(Boolean));

const deleteProjectImageKeysFromS3 = async (keys) => {
  for (const key of keys) {
    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      }).promise();
      console.log("Deleted project image from S3:", key);
    } catch (error) {
      console.error("Failed to delete project image from S3:", key, error);
    }
  }
};

const deleteProjectImagesFromS3 = async (project) =>
  deleteProjectImageKeysFromS3(getProjectImageKeys(project));

const parseExistingImageKeys = (value) => {
  const keys = typeof value === "string" ? JSON.parse(value) : value;

  if (!Array.isArray(keys) || keys.some((key) => typeof key !== "string" || !key.trim())) {
    throw new Error("existingImageKeys must be a JSON array of image keys");
  }

  return [...new Set(keys)];
};

/* ================= GET SINGLE PROJECT BY ID ================= */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

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
    console.log("Uploaded project image count:", getUploadedProjectImages(req.files).length);

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

    const projectImages = getUploadedProjectImages(req.files);
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
      image: projectImages[0] || null,
      images: projectImages,
    };

    // Optional file upload
    if (req.files && req.files.file && req.files.file[0]) {
      projectData.file = req.files.file[0].location;
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
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project data",
        error: error.message,
      });
    }
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
    // Fetch existing project first (to get old image key for S3 cleanup)
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Determine projectType from body (frontend sends "category" or "projectType")
    const projectType = req.body.projectType || req.body.category || existingProject.projectType;

    // Clean up undefined values so MongoDB doesn't try to set them
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (projectType) updateData.projectType = projectType;
    if (req.body.sector !== undefined) updateData.sector = req.body.sector;
    if (req.body.subCategory !== undefined) updateData.subCategory = req.body.subCategory;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.content !== undefined) updateData.content = req.body.content;
    if (req.body.area !== undefined) updateData.area = req.body.area;
    if (req.body.serialNumber !== undefined) {
      updateData.serialNumber = parseInt(req.body.serialNumber) || 0;
    }
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

    const currentImages = (existingProject.images || []).map((image) =>
      typeof image.toObject === "function" ? image.toObject() : image
    );
    const projectImages = getUploadedProjectImages(req.files);
    let existingImageKeys;

    if (req.body.existingImageKeys !== undefined) {
      try {
        existingImageKeys = parseExistingImageKeys(req.body.existingImageKeys);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      const currentImagesByKey = new Map(currentImages.map((image) => [image.key, image]));
      const unknownKeys = existingImageKeys.filter((key) => !currentImagesByKey.has(key));
      if (unknownKeys.length) {
        return res.status(400).json({
          success: false,
          message: "One or more existing image keys do not belong to this project",
        });
      }

      const retainedImages = existingImageKeys.map((key) => currentImagesByKey.get(key));
      const finalImages = [...retainedImages, ...projectImages];
      updateData.images = finalImages;
      updateData.image = finalImages[0] || null;
    } else if (projectImages.length) {
      updateData.image = projectImages[0];
      updateData.images = projectImages;
    }

    // If new file uploaded → set new one
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

    if (existingImageKeys !== undefined || projectImages.length) {
      const retainedKeys = getProjectImageKeys(updated);
      const removedKeys = [...getProjectImageKeys(existingProject)].filter((key) => !retainedKeys.has(key));
      await deleteProjectImageKeysFromS3(removedKeys);
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message
    });
  }
};

/* ================= REMOVE PROJECT IMAGE ================= */
export const removeProjectImage = async (req, res) => {
  try {
    const { key } = req.body;
    if (typeof key !== "string" || !key.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image key is required",
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const currentImages = (project.images || []).map((image) =>
      typeof image.toObject === "function" ? image.toObject() : image
    );
    if (project.image?.key && !currentImages.some((image) => image.key === project.image.key)) {
      currentImages.unshift({
        url: project.image.url,
        key: project.image.key,
      });
    }

    const remainingImages = currentImages.filter((image) => image.key !== key);
    if (remainingImages.length === currentImages.length) {
      return res.status(404).json({
        success: false,
        message: "Image not found in this project",
      });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        images: remainingImages,
        image: remainingImages[0] || null,
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      }).promise();
    } catch (error) {
      console.error("Project image removed from database but S3 deletion failed:", key, error);
      return res.status(502).json({
        success: false,
        message: "Image was removed from the project, but storage cleanup failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project image removed successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Remove project image error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove project image",
      error: error.message,
    });
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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await deleteProjectImagesFromS3(project);

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Project permanently deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};