// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "MANORATE AND BOUNDARY CONSTRUCTION",
        "ROAD NETWORK",
        "WATER SUPPLY",
        "ELECTRICITY",
      ],
      set: (value) => value.toUpperCase(), // 🔥 MAIN FIX
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
