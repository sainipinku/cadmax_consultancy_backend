import SubCategory from "../models/SubCategory.model.js";

/* ================= CREATE ================= */
export const createSubCategory = async (req, res) => {
  try {
    const { name, category, status, description } = req.body;

    const subCategory = await SubCategory.create({
      name,
      category,
      description,
      status,
      image: req.file?.path || "",
    });

    res.status(201).json({
      success: true,
      data: subCategory,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL ================= */
export const getSubCategories = async (req, res) => {
  try {
    const data = await SubCategory.find().populate("category");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET BY CATEGORY ================= */
export const getSubByCategory = async (req, res) => {
  try {
    const data = await SubCategory.find({
      category: req.params.categoryId,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateSubCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "SubCategory deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
