import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {
  // Allow images for "image" field
  const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  // Allow documents for "file" field
  const docTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];
  
  if (file.fieldname === "image") {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP) allowed for project image"), false);
    }
  } else if (file.fieldname === "file") {
    if (docTypes.includes(file.mimetype) || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX files allowed for document upload"), false);
    }
  } else {
    cb(new Error("Unexpected field"), false);
  }
};

/* ================= MULTER UPLOAD - LOCAL DISK STORAGE ================= */
// Files are saved to local disk and served via static middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s/g, "_");
    cb(null, uniqueSuffix + "-" + safeName);
  },
});

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for documents
});
