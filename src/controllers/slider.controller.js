import SliderImage from "../models/SliderImage.js";

export const getSliderImages = async (req, res) => {
  try {
    const { slug } = req.params;

    const slides = await SliderImage.find({ serviceSlug: slug });

    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: "Failed to load slider images" });
  }
};
