import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.model.js";
import { hashPassword } from "./hashPassword.js";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

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
