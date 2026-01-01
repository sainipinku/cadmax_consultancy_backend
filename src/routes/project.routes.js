// routes/project.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();


// MULTER CONFIG

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/projects");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const upload = multer({ storage });


// ROUTES

router.get("/", getProjects);

router.post("/", upload.single("image"), createProject);

router.put("/:id", upload.single("image"), updateProject);

router.delete("/:id", deleteProject);

export default router;
