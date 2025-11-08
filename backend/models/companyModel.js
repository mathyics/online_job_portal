const db = require('../config/db');

async function findCompanyByName(company_name) {
  const [rows] = await db.query('SELECT * FROM Company WHERE company_name = ?', [company_name]);
  return rows[0] || null;
}

async function createCompany(company_name, industry, website, address) {
  const existing = await findCompanyByName(company_name);
  if (existing) return existing;

  const [res] = await db.query(
    'INSERT INTO Company (company_name, industry, website, address) VALUES (?, ?, ?, ?)',
    [company_name, industry, website, address]
  );
  return { company_id: res.insertId, company_name, industry, website, address };
}

async function getCompanyById(company_id) {
  const [rows] = await db.query('SELECT * FROM Company WHERE company_id = ?', [company_id]);
  return rows[0] || null;
}

module.exports = {
  findCompanyByName,
  createCompany,
  getCompanyById
};
