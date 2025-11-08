const db = require('../config/db');

async function createEmployerProfile(employer_id, company_id, position_title) {
  const [existing] = await db.query('SELECT * FROM Employee WHERE employer_id = ?', [employer_id]);
  if (existing.length > 0) {
    const [res] = await db.query('UPDATE Employee SET company_id = ?, position_title = ? WHERE employer_id = ?', [company_id, position_title, employer_id]);
    return { updated: true };
  } else {
    const [res] = await db.query('INSERT INTO Employee (employer_id, company_id, position_title) VALUES (?, ?, ?)', [employer_id, company_id, position_title]);
    return { created: true, employer_id };
  }
}

async function getEmployerByUserId(employer_id) {
  const [rows] = await db.query('SELECT e.*, c.company_name, c.industry, c.website, c.address FROM Employee e LEFT JOIN Company c ON e.company_id = c.company_id WHERE e.employer_id = ?', [employer_id]);
  return rows[0] || null;
}

module.exports = {
  createEmployerProfile,
  getEmployerByUserId
};
