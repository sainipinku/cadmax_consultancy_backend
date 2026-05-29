import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

/* ROUTES */
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subCategory.routes.js";
import projectRoutes from "./routes/project.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js"; // 

const app = express();

// Trust proxy - required when behind a reverse proxy 
// so that express-rate-limit can correctly identify client IPs from X-Forwarded-For header
app.set("trust proxy", 1);


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============ RATE LIMITING ============ */

// 1. Login API - 15 min (brute force )
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Contact/Inquiry form - 1 min => 3 requests (email bombing )
const inquiryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3,
  message: {
    success: false,
    message: "Too many submissions. Please wait a minute before sending another inquiry.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. General APIs - 15 min => 100 requests (DDoS )
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all /api routes
app.use("/api", generalLimiter);

// Apply login limiter specifically
app.use("/api/admin/login", loginLimiter);

// Apply inquiry limiter specifically
app.use("/api/inquiries", inquiryLimiter);

/* ======================================= */

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