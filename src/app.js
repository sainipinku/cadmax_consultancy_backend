import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";

import adminSidebarRoutes from "./routes/adminSidebar.routes.js";



import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subCategory.routes.js";

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   STATIC FILES
====================== */
app.use("/uploads", express.static("uploads"));

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);



/* 🔥 ADMIN SIDEBAR */
app.use("/api/admin", adminSidebarRoutes);







app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);

export default app;
