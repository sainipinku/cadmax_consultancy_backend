import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/serviceCategory.controller.js";

import { uploadImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  uploadImage.single("image"),
  createCategory
);

/* GET ALL */
router.get("/", getCategories);

/* GET ONE */
router.get("/:id", getCategoryById);

/* UPDATE */
router.put(
  "/:id",
  uploadImage.single("image"),
  updateCategory
);

/* DELETE */
router.delete("/:id", deleteCategory);

export default router;
