import express from "express";
import {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategory.controller.js";

import { uploadImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  uploadImage.single("image"),
  createSubCategory
);

/* UPDATE */
router.put(
  "/:id",
  uploadImage.single("image"),
  updateSubCategory
);

/* GET ALL (FILTER BY service / sectionType) */
router.get("/", getSubCategories);

/* DELETE */
router.delete("/:id", deleteSubCategory);

export default router;
