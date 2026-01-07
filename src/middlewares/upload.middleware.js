import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

/* ================= AWS S3 (SDK v2 ONLY) ================= */

const s3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

/* ================= MULTER UPLOAD ================= */
const UPLOADS_FOLDER = "cadmax-consultancy-uploads/"
export const uploadImage = multer({
  storage: multerS3({
    s3, // ✅ MUST be AWS SDK v2 S3
    bucket: process.env.S3_BUCKET_NAME || "cadmaxpro-buket",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const safeName = file.originalname
                ? file.originalname.replace(/\s/g, '')
                : 'file';
            cb(null, `${UPLOADS_FOLDER}${Date.now()}-${safeName}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
