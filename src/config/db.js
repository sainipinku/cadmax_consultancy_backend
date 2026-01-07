import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://pradeepsaini2206_db_user:Pd8bFmfbT%25Se-G8@cluster0.abw97u4.mongodb.net/?appName=Cluster0");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
