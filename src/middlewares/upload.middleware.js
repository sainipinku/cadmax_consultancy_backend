import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const isMimeValid = allowedTypes.test(file.mimetype);
  const isExtValid = allowedTypes.test(
    file.originalname.toLowerCase()
  );

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"), false);
  }
};

// ================= PROJECT IMAGE STORAGE =================
const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cadmax/projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// ================= SERVICE IMAGE STORAGE =================
const serviceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cadmax/services",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// ================= MULTER EXPORTS =================
export const uploadProjectImage = multer({
  storage: projectStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadServiceImage = multer({
  storage: serviceStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});



