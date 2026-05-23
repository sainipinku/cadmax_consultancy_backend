import express from "express";
import cors from "cors";
import path from "path";

/* ROUTES */
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subCategory.routes.js";
import projectRoutes from "./routes/project.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js"; // 

const app = express();

/* MIDDLEWARES */
app.use(
  cors({
    origin: process.env.WEBSITE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* STATIC FILES - Serve uploaded files */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ROUTES */

/*  ADMIN */
app.use("/api/admin", adminRoutes);

/*  OTHER MODULES */
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/projects", projectRoutes);

/* INQUIRIES */
app.use("/api/inquiries", inquiryRoutes);

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("Cadmax Backend API Running ");
});

export default app;
