const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// ✅ Get all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM JobCategory');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new category
router.post('/create', async (req, res) => {
  try {
    const { category_name, description } = req.body;
    if (!category_name)
      return res.status(400).json({ message: "category_name required" });

    await pool.query(
      'INSERT INTO JobCategory (category_name, description) VALUES (?, ?)',
      [category_name, description]
    );
    res.json({ message: 'Category created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
