import ServiceCategory from "../models/ServiceCategory.js";
import slugify from "slugify";

export const addCategory = async (req, res) => {
  const { title, thumbnail } = req.body;

  const category = await ServiceCategory.create({
    title,
    slug: slugify(title, { lower: true }),
    thumbnail,
  });

  res.json(category);
};

export const getCategories = async (req, res) => {
  const data = await ServiceCategory.find();
  res.json(data);
};

export const updateCategory = async (req, res) => {
  const data = await ServiceCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
};

export const deleteCategory = async (req, res) => {
  await ServiceCategory.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
