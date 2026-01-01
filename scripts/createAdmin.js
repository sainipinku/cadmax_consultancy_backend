import mongoose from "mongoose";
import "../src/config/env.js";
import Admin from "../src/models/Admin.model.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: "admin@cadmax.com" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      email: "admin@cadmax.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
