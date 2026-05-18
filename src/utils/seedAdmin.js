import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.model.js";
import { hashPassword } from "./hashPassword.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI;

    await mongoose.connect(mongoUri);

    const adminEmail = process.env.ADMIN_EMAIL;

    const exists = await Admin.findOne({
      email: adminEmail,
    });

    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashed = await hashPassword(
      process.env.ADMIN_PASSWORD
    );

    await Admin.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashed,
    });

    console.log("Admin created successfully");

    process.exit();
  } catch (error) {
    console.log("Seeder Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();