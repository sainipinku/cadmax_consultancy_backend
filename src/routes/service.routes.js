import express from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/serviceCategory.controller.js";

import {
  getMainPage,
  updateMainPage,
} from "../controllers/serviceMainPage.controller.js";

import {
  addSubPage,
  getSubPages,
  updateSubPage,
  deleteSubPage,
} from "../controllers/serviceSubPage.controller.js";

const router = express.Router();

/* ---------------- SERVICE CATEGORIES ---------------- */
router.post("/admin/categories", addCategory);
router.get("/categories", getCategories);
router.put("/admin/categories/:id", updateCategory);
router.delete("/admin/categories/:id", deleteCategory);

/* ---------------- MAIN PAGE ---------------- */
router.get("/main/:category", getMainPage);
router.put("/admin/main/:category", updateMainPage);

/* ---------------- SUB PAGES ---------------- */
router.post("/admin/subpages/:category", addSubPage);
router.get("/subpages/:category", getSubPages);
router.put("/admin/subpages/:id", updateSubPage);
router.delete("/admin/subpages/:id", deleteSubPage);

export default router;
