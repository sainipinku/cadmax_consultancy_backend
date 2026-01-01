import mongoose from "mongoose";

const serviceSubPageSchema = new mongoose.Schema(
  {
    categorySlug: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    heroImage: String,
    content: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "ServiceSubPage",
  serviceSubPageSchema
);
