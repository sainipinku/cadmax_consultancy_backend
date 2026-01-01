import ServiceMainPage from "../models/ServiceMainPage.js";

export const getMainPage = async (req, res) => {
  const data = await ServiceMainPage.findOne({
    categorySlug: req.params.category,
  });

  res.json(data);
};

export const updateMainPage = async (req, res) => {
  const data = await ServiceMainPage.findOneAndUpdate(
    { categorySlug: req.params.category },
    req.body,
    { upsert: true, new: true }
  );

  res.json(data);
};
