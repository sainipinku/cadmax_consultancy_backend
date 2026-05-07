import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.model.js";

dotenv.config();

// Connect to DB using same config as server
await connectDB();

const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD;

const exists = await Admin.findOne({ email: adminEmail });

if (!adminPassword) {
  console.log("❌ Error: Set ADMIN_PASSWORD in .env file");
  console.log("   Example: ADMIN_PASSWORD=your_secure_password");
  process.exit(1);
}

if (!exists) {
  await Admin.create({
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, 10),
  });
  console.log("✅ Admin created");
} else {
  console.log("⚠️ Admin already exists");
}

process.exit();
