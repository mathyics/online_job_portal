const db = require('../config/db');

async function getAllCategories() {
  const [rows] = await db.query('SELECT category_id, category_name FROM JobCategory');
  return rows;
}

module.exports = { getAllCategories };
