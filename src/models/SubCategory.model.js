import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    /* ================= SERVICE TYPE ================= */
    service: {
      type: String,
      enum: ["engineering", "surveying", "planning"],
      required: true,
      index: true, // fast filtering
    },

    /* ================= PAGE SECTION ================= */
    sectionType: {
      type: String,
      enum: ["hero", "overlap", "content", "collage"],
      required: true,
    },

    /* ================= TEXT CONTENT ================= */
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    redirectLink: {
      type: String, // collage item click link
    },

    /* ================= IMAGE (AWS S3) ================= */
    image: {
      url: {
        type: String, // public S3 URL
      },
      key: {
        type: String, // S3 object key (delete ke liye)
      },
    },

    /* ================= STATUS ================= */
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
