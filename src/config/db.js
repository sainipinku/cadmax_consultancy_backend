import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://sainiaarav5_db_user:xLPxtMt1GMT1c8Sj@cluster0.52rkmfd.mongodb.net/?appName=Cluster0");
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
