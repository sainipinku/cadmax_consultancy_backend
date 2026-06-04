// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      url: {
        type: String,
        trim: true,
        default: null,
      },
      key: {
        type: String,
        trim: true,
        default: null,
      },
    },

    heroImage: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      trim: true,
    },

    sector: {
      type: String,
      required: true,
      enum: ["ENGINEERING", "SURVEYING", "PLANNING"],
      set: (value) => (value ? value.toUpperCase() : value),
    },

    subCategory: {
      type: String,
      enum: [
        "TRANSPORTATION",
        "WATER INFLUENCE",
        "ENERGY SECTOR",
        "IRRIGATION SECTOR",
        "CITY SURVEY SECTOR",
        "REAL ESTATE SECTOR",
        "",
        null
      ],
      default: "",
      set: (value) => (value ? value.toUpperCase() : value),
    },

    projectType: {
      type: String,
      required: true,
      enum: [
        "PROJECT CARD",
        "PROJECT LIST",
      ],
      set: (value) => (value ? value.toUpperCase() : value),
    },

    area: {
      type: String,
      trim: true,
    },

    file: {
      type: String,
      trim: true,
    },

    serialNumber: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);