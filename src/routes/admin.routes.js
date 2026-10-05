import express from "express";
import { loginAdmin, getProfile } from "../controllers/admin.controller.js";
import protect from "../middlewares/auth.middleware.js";

/* IMPORT CONTROLLERS */
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/serviceCategory.controller.js";

import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategory.controller.js";

import {
  createSliderImage,
  getSliderImages,
  getSliderImageById,
  updateSliderImage,
  deleteSliderImage,
} from "../controllers/slider.controller.js";

import {
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/inquiry.controller.js";

import {
  createProject,
  getProjects,
  getAllProjectsAdmin,
  updateProject,
  removeProjectImage,
  deleteProject,
  restoreProject,
  permanentDeleteProject,
} from "../controllers/project.controller.js";

import { handleMulterError, uploadImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/login", loginAdmin);
router.get("/profile", protect, getProfile);

/* ================= CATEGORIES ================= */
router.post("/categories", protect, uploadImage.single("image"), createCategory);
router.get("/categories", protect, getCategories);
router.get("/categories/:id", protect, getCategoryById);
router.put("/categories/:id", protect, uploadImage.single("image"), updateCategory);
router.delete("/categories/:id", protect, deleteCategory);

/* ================= SUBCATEGORIES ================= */
router.post("/subcategories", protect, uploadImage.single("image"), createSubCategory);
router.get("/subcategories", protect, getSubCategories);
router.get("/subcategories/:id", protect, getSubCategoryById);
router.put("/subcategories/:id", protect, uploadImage.single("image"), updateSubCategory);
router.delete("/subcategories/:id", protect, deleteSubCategory);

/* ================= SLIDER IMAGES ================= */
router.post("/slider", protect, uploadImage.single("image"), createSliderImage);
router.get("/slider", protect, getSliderImages);
router.get("/slider/:id", protect, getSliderImageById);
router.put("/slider/:id", protect, uploadImage.single("image"), updateSliderImage);
router.delete("/slider/:id", protect, deleteSliderImage);

/* ================= PROJECTS ================= */
router.get("/projects", protect, getAllProjectsAdmin);

// Optional file upload middleware - handles cases when no files are uploaded
const optionalUpload = (req, res, next) => {
  const upload = uploadImage.fields([
    { name: "image", maxCount: 10 },
    { name: "images", maxCount: 10 },
    { name: "file", maxCount: 1 },
  ]);

  upload(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
};

router.post("/projects", protect, optionalUpload, createProject);
router.put("/projects/:id", protect, optionalUpload, updateProject);
router.delete("/projects/:id/images", protect, removeProjectImage);
router.delete("/projects/:id", protect, deleteProject);
router.put("/projects/:id/restore", protect, restoreProject);
router.delete("/projects/:id/permanent", protect, permanentDeleteProject);

/* ================= INQUIRIES ================= */
router.get("/inquiries", protect, getInquiries);
router.get("/inquiries/:id", protect, getInquiryById);
router.put("/inquiries/:id/status", protect, updateInquiryStatus);
router.delete("/inquiries/:id", protect, deleteInquiry);

export default router;
