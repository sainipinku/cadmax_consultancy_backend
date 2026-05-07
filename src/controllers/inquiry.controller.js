import Inquiry from "../models/Inquiry.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";

/* ================= CREATE INQUIRY ================= */
export const createInquiry = async (req, res) => {
  try {
    const { name, fullName, email, phone, message } = req.body;

    const finalName = name || fullName;

    if (!finalName || !email || !message) {
      return res.status(400).json({ message: "Name, Email, Message required" });
    }

    const inquiry = await Inquiry.create({
      name: finalName,
      email,
      phone,
      message,
      status: "unread", // ✅ force default for admin + frontend
    });

    // 📩 send email to admin
    await sendEmail({
      name: finalName,
      email,
      phone,
      message,
    });

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (err) {
    console.error("Create Inquiry Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL INQUIRIES ================= */
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    console.error("Get Inquiries Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("PARAM ID =", id);
    console.log("BODY =", req.body);

    // ❌ invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }

    // ❌ missing status
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // ❌ block invalid values
    const allowedStatuses = ["unread", "read", "replied"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        allowed: allowedStatuses,
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry status updated successfully",
      data: inquiry,
    });
  } catch (err) {
    console.error("Update Inquiry Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET INQUIRIES (ADMIN) ================= */
export const getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) {
      filter.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Inquiry.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get Inquiries Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET INQUIRY BY ID ================= */
export const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }
    
    const inquiry = await Inquiry.findById(id);
    
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (err) {
    console.error("Get Inquiry Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE INQUIRY ================= */
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }
    
    const inquiry = await Inquiry.findByIdAndDelete(id);
    
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (err) {
    console.error("Delete Inquiry Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
