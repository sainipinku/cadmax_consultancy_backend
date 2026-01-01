import ServiceSubPage from "../models/ServiceSubPage.js";
import slugify from "slugify";

export const addSubPage = async (req, res) => {
  const { title, thumbnail, content } = req.body;

  const page = await ServiceSubPage.create({
    categorySlug: req.params.category,
    title,
    slug: slugify(title, { lower: true }),
    thumbnail,
    content,
  });

  res.json(page);
};

export const getSubPages = async (req, res) => {
  const pages = await ServiceSubPage.find({
    categorySlug: req.params.category,
  });

  res.json(pages);
};

export const updateSubPage = async (req, res) => {
  const page = await ServiceSubPage.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(page);
};

export const deleteSubPage = async (req, res) => {
  await ServiceSubPage.findByIdAndDelete(req.params.id);
  res.json({ message: "Sub page deleted" });
};
