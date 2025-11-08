const db = require('../config/db');

async function postJob(employer_id, category_id, title, description, skills_required, location, salary, deadline) {
  const [rows] = await db.query(
    `INSERT INTO Jobs (employer_id, category_id, title, description, skills_required, location, salary, posted_date, deadline, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'Open')`,
    [employer_id, category_id, title, description, skills_required, location, salary, deadline]
  );
  return rows;
}

async function getOpenJobs(category_id = null) {
  let query = `
    SELECT j.*, c.category_name
    FROM Jobs j
    JOIN JobCategory c ON j.category_id = c.category_id
    WHERE j.status = 'Open'
  `;
  const params = [];
  if (category_id) {
    query += ' AND j.category_id = ?';
    params.push(category_id);
  }
  const [rows] = await db.query(query, params);
  return rows;
}

async function getJobsByEmployer(employer_id) {
  const query = `
    SELECT j.*, c.category_name,
    (SELECT COUNT(*) FROM Applications WHERE job_id = j.job_id) as application_count
    FROM Jobs j
    LEFT JOIN JobCategory c ON j.category_id = c.category_id
    WHERE j.employer_id = ?
    ORDER BY j.posted_date DESC
  `;
  const [rows] = await db.query(query, [employer_id]);
  return rows;
}

module.exports = { postJob, getOpenJobs, getJobsByEmployer };
