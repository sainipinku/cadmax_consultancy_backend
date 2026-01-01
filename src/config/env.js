//Environment variables loader

import dotenv from "dotenv";
import path from "path";

/* ---------------- LOAD ENV ---------------- */
dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});

/* ---------------- EXPORT ENV ---------------- */
const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "cadmax_secret_key",
  NODE_ENV: process.env.NODE_ENV || "development"
};

export default env;
