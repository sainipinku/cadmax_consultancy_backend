import SubCategory from "../models/SubCategory.model.js";
import s3 from "../config/s3.js";

/* ================= CREATE ================= */
export const createSubCategory = async (req, res) => {
  try {
    const {
      service,
      sectionType,
      title,
      description,
      redirectLink,
      status,
    } = req.body;

    const subCategory = await SubCategory.create({
      service,        // engineering | surveying | planning
      sectionType,    // hero | overlap | content | collage
      title,
      description,
      redirectLink,
      status,
      image: req.file
        ? {
            url: req.file.location, // S3 public URL
            key: req.file.key,      // S3 object key
          }
        : undefined,
    });

    res.status(201).json({
      success: true,
      data: subCategory,
    });
  } catch (err) {
    console.error("CREATE SUBCATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL / FILTER ================= */
export const getSubCategories = async (req, res) => {
  try {
    const { service, sectionType, status } = req.query;

    const filter = {};
    if (service) filter.service = service;
    if (sectionType) filter.sectionType = sectionType;
    if (status !== undefined) filter.status = status;

    const data = await SubCategory.find(filter).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("GET SUBCATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET BY ID ================= */
export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subCategory = await SubCategory.findById(id);
    
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }
    
    res.json({
      success: true,
      data: subCategory,
    });
  } catch (err) {
    console.error("GET SUBCATEGORY BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateSubCategory = async (req, res) => {
  try {
    const existing = await SubCategory.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    const updateData = { ...req.body };

    /* 🔥 If new image uploaded → delete old S3 image */
    if (req.file) {
      if (existing.image?.key) {
        await s3
          .deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: existing.image.key,
          })
          .promise();
      }

      updateData.image = {
        url: req.file.location,
        key: req.file.key,
      };
    }

    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("UPDATE SUBCATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteSubCategory = async (req, res) => {
  try {
    const item = await SubCategory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    /* 🔥 Delete image from S3 */
    if (item.image?.key) {
      await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: item.image.key,
        })
        .promise();
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "SubCategory deleted successfully",
    });
  } catch (err) {
    console.error("DELETE SUBCATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
