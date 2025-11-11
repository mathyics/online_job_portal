const { getAllCategories } = require('../models/categoryModel');

exports.listCategories = async (req, res) => {
  try {
    const cats = await getAllCategories();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
