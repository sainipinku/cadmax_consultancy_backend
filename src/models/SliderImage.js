import mongoose from "mongoose";

const sliderImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    image: {
      url: String,
      public_id: String,
    },

    serviceSlug: {
      type: String,
      required: true, // maingate, surveying, planning
    },
  },
  { timestamps: true }
);

export default mongoose.model("SliderImage", sliderImageSchema);
