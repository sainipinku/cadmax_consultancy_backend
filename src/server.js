import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// ROUTES
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subCategory.routes.js";
import projectRoutes from "./routes/project.routes.js";


const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// DB CONNECT
connectDB();

// TEST ROUTE
app.get("/api", (req, res) => {
  res.send("API is running 🚀");
});

// 🔥🔥 ROUTES REGISTER HERE 🔥🔥
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/projects", projectRoutes);

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
