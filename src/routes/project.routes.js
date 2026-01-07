import express from "express";
import {
  createProject,
  getProjects,
  deleteProject,
} from "../controllers/project.controller.js";

import {
  uploadImage,
} from "../middlewares/upload.middleware.js";

const router = express.Router();

/* CREATE PROJECT */
router.post(
  "/",
  uploadImage.single("image"),
  createProject
);

/* GET PROJECTS */
router.get("/", getProjects);

/* DELETE PROJECT */
router.delete("/:id", deleteProject);

export default router;
