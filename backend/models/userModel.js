const db = require('../config/db');

async function createUser(full_name, email, password, phone, role) {
  const [rows] = await db.query(
    "INSERT INTO Users (full_name, email, password, phone, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
    [full_name, email, password, phone, role]
  );
  return rows;
}

async function getUserByEmail(email) {
  const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
  return rows[0];
}

module.exports = { createUser, getUserByEmail };
