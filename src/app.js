import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";

import serviceRoutes from "./routes/service.routes.js";




const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// ======================
// STATIC FILES (IMAGES)
// ======================
app.use("/uploads", express.static("uploads"));


app.use("/uploads", express.static("uploads"));
app.use("/api", serviceRoutes);


app.use("/api/services", serviceRoutes);

export default app;
