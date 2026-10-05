import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {
  // Allow images for the project image fields
  const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  // Allow documents for "file" field
  const docTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];
  
  if (file.fieldname === "image" || file.fieldname === "images") {
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

/* ================= MULTER UPLOAD - S3 STORAGE ================= */
// Files are uploaded to S3 bucket and served via CloudFront/S3 URL
const storage = multerS3({
  s3,
  bucket: process.env.S3_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s/g, "_");
    const folder = file.fieldname === "file" ? "projects/files" : "projects/images";
    cb(null, `${folder}/${uniqueSuffix}-${safeName}`);
  },
});

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 11 }, // 10 images and one optional document
});

/* ================= MULTER ERROR HANDLER MIDDLEWARE ================= */
// Use this middleware after uploadImage to catch multer errors (e.g., file too large)
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size should be less than 10MB",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Too many files in this field or unsupported file field",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "You can upload up to 10 project images and one document",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle custom file filter errors
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};
