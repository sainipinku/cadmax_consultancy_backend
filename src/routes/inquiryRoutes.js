import express from "express";

import {
    sendInquiry,
} from "../controllers/inquiryController.js";

const router = express.Router();

// Public route - auth middleware mat lagana
router.post(
    "/inquiries",
    sendInquiry
);

export default router;