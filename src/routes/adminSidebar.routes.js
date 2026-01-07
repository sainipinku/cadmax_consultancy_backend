import express from "express";
import ServiceCategory from "../models/Category.model.js";

const router = express.Router();

router.get("/admin/sidebar/services", async (req, res) => {
  try {
    const services = await ServiceCategory.find()
      .populate("pages", "title hasProjects");

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to load sidebar services" });
  }
});

export default router;
