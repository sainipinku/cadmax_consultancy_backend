import mongoose from "mongoose";

const serviceMainPageSchema = new mongoose.Schema(
  {
    categorySlug: {
      type: String,
      required: true,
      unique: true, // ek hi main page hoga
    },

    heroImage: String,
    bannerImage: String,

    heading: String,
    description: String,
    offerText: String,

    overlapImage: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "ServiceMainPage",
  serviceMainPageSchema
);
