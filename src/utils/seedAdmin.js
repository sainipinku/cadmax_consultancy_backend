import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.model.js";
import { hashPassword } from "./hashPassword.js";

dotenv.config();

const seedAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/cadmax";
  await mongoose.connect(mongoUri);

  const exists = await Admin.findOne({
    email: "admin@cadmax.com"
  });

  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await hashPassword("admin123");

  await Admin.create({
    name: "Cadmax Admin",
    email: "admin@cadmax.com",
    password: hashed
  });

  console.log("Admin created");
  process.exit();
};

seedAdmin();
