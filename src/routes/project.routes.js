import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getAvailableSectors,
  getAllProjectsAdmin,
  updateProject,
  deleteProject,
  restoreProject,
  permanentDeleteProject,
} from "../controllers/project.controller.js";

import { uploadImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* GET ALL PROJECTS (PUBLIC) */
router.get("/", getProjects);

/* GET PROJECTS BY SECTOR (PUBLIC) */
router.get("/sector/:sector", getProjects);

/* GET ALL SECTORS (PUBLIC) */
router.get("/sectors/list", getAvailableSectors);

/* GET ALL PROJECTS (ADMIN) */
router.get("/admin/all", getAllProjectsAdmin);

/* GET SINGLE PROJECT BY ID */
router.get("/:id", getProjectById);

/* CREATE PROJECT */
router.post(
  "/",
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createProject
);

/* UPDATE PROJECT */
router.put(
  "/:id",
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateProject
);

/* SOFT DELETE PROJECT */
router.delete("/:id", deleteProject);

/* RESTORE PROJECT */
router.put("/:id/restore", restoreProject);

/* PERMANENT DELETE PROJECT */
router.delete("/:id/permanent", permanentDeleteProject);

export default router;
