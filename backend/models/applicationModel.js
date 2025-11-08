const db = require('../config/db');

async function applyToJob(job_id, jobseeker_id, cover_letter, resume_url) {
  const [rows] = await db.query(
    `INSERT INTO Applications (job_id, jobseeker_id, apply_date, status, cover_letter, resume_url)
     VALUES (?, ?, NOW(), 'Pending', ?, ?)`,
    [job_id, jobseeker_id, cover_letter, resume_url]
  );
  return rows;
}

async function getApplicationsByJobseeker(jobseeker_id) {
  const [rows] = await db.query(`
    SELECT a.application_id, a.status, a.apply_date, j.title, j.location, j.salary, j.deadline
    FROM Applications a
    JOIN Jobs j ON a.job_id = j.job_id
    WHERE a.jobseeker_id = ?
  `, [jobseeker_id]);
  return rows;
}

async function getApplicationsByJob(job_id) {
  const [rows] = await db.query(`
    SELECT a.application_id, a.status, a.apply_date, u.full_name, u.email, js.resume_url
    FROM Applications a
    JOIN JobSeeker js ON a.jobseeker_id = js.jobseeker_id
    JOIN Users u ON js.jobseeker_id = u.user_id
    WHERE a.job_id = ?
  `, [job_id]);
  return rows;
}

async function updateApplicationStatus(application_id, status) {
  const [rows] = await db.query(
    `UPDATE Applications SET status = ? WHERE application_id = ?`,
    [status, application_id]
  );
  return rows;
}

module.exports = {
  applyToJob,
  getApplicationsByJobseeker,
  getApplicationsByJob,
  updateApplicationStatus
};
