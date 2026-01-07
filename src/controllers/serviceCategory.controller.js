import Category from "../models/Category.model.js";

/* ================= CREATE CATEGORY ================= */
export const createCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Section name is required" });
    }

    if (!req.file || !req.file.location || !req.file.key) {
      return res.status(400).json({ message: "Valid image is required" });
    }

    const category = await Category.create({
      name: name.trim(),
      image: {
        url: req.file.location,
        key: req.file.key,
      },
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("❌ CREATE CATEGORY ERROR:", err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* ================= GET ALL ================= */
export const getCategories = async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ================= UPDATE ================= */
export const updateCategory = async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILE:", req.file);

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.body.name && req.body.name.trim() !== "") {
      category.name = req.body.name.trim();
    }

    if (req.file && req.file.location && req.file.key) {
      category.image = {
        url: req.file.location,
        key: req.file.key,
      };
    }

    await category.save();
    res.json(category);
  } catch (err) {
    console.error("❌ UPDATE CATEGORY ERROR:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= DELETE ================= */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // (Optional) delete image from S3 here

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};

/* ================= GET BY ID ================= */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Invalid category ID" });
  }
};
