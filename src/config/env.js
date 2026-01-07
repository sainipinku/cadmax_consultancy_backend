// config/env.js
import dotenv from "dotenv";
import path from "path";

/* ---------------- LOAD ENV ---------------- */
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

/* ---------------- EXPORT ENV ---------------- */
const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET || "cadmax_secret_key",
  NODE_ENV: process.env.NODE_ENV || "development",

  // 🔥 CLOUDINARY (THIS WAS MISSING)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default env;
