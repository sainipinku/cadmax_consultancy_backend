import SliderImage from "../models/SliderImage.js";

/* ================= GET ALL SLIDER IMAGES ================= */
export const getSliderImages = async (req, res) => {
  try {
    const { serviceSlug } = req.query;
    
    let filter = {};
    if (serviceSlug) {
      filter.serviceSlug = serviceSlug;
    }
    
    const slides = await SliderImage.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (err) {
    console.error("Get Slider Images Error:", err);
    res.status(500).json({ message: "Failed to load slider images" });
  }
};

/* ================= GET SLIDER IMAGE BY ID ================= */
export const getSliderImageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const slide = await SliderImage.findById(id);
    
    if (!slide) {
      return res.status(404).json({ message: "Slider image not found" });
    }
    
    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (err) {
    console.error("Get Slider Image Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE SLIDER IMAGE ================= */
export const createSliderImage = async (req, res) => {
  try {
    const { title, serviceSlug } = req.body;
    
    if (!title || !serviceSlug) {
      return res.status(400).json({ 
        message: "Title and serviceSlug are required" 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        message: "Image is required" 
      });
    }
    
    const slide = await SliderImage.create({
      title,
      serviceSlug,
      image: {
        url: req.file.location,
        public_id: req.file.key,
      },
    });
    
    res.status(201).json({
      success: true,
      message: "Slider image created successfully",
      data: slide,
    });
  } catch (err) {
    console.error("Create Slider Image Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE SLIDER IMAGE ================= */
export const updateSliderImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, serviceSlug } = req.body;
    
    const slide = await SliderImage.findById(id);
    
    if (!slide) {
      return res.status(404).json({ message: "Slider image not found" });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (serviceSlug) updateData.serviceSlug = serviceSlug;
    
    if (req.file) {
      updateData.image = {
        url: req.file.location,
        public_id: req.file.key,
      };
    }
    
    const updatedSlide = await SliderImage.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Slider image updated successfully",
      data: updatedSlide,
    });
  } catch (err) {
    console.error("Update Slider Image Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE SLIDER IMAGE ================= */
export const deleteSliderImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const slide = await SliderImage.findById(id);
    
    if (!slide) {
      return res.status(404).json({ message: "Slider image not found" });
    }
    
    await SliderImage.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Slider image deleted successfully",
    });
  } catch (err) {
    console.error("Delete Slider Image Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
