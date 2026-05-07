import express from "express";
import {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
} from "../controllers/inquiry.controller.js";

const router = express.Router();

/* ================= PUBLIC ================= */
// frontend form submit
router.post("/", createInquiry);


/* ================= ADMIN ================= */
// get all inquiries
router.get("/", getAllInquiries);

// update inquiry status (unread | read | replied)
router.put("/:id/status", updateInquiryStatus); // ✅ clearer + safer route


export default router;
