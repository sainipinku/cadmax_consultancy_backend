import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },

    // ✅ unified status system
    status: {
      type: String,
      enum: ["unread", "read", "replied"], // admin + frontend friendly
      default: "unread",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
