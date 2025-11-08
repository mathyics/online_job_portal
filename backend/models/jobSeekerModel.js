const db = require('../config/db');

async function getJobSeekerById(jobseeker_id) {
  const [rows] = await db.query('SELECT js.*, u.email, u.full_name, u.phone FROM JobSeeker js JOIN Users u ON js.jobseeker_id = u.user_id WHERE js.jobseeker_id = ?', [jobseeker_id]);
  return rows[0] || null;
}

async function createJobSeekerProfile(jobseeker_id, skills, education, experience, resume_url, preferred_location) {
  const [existing] = await db.query('SELECT * FROM JobSeeker WHERE jobseeker_id = ?', [jobseeker_id]);
  if (existing.length > 0) {
    const [res] = await db.query(
      `UPDATE JobSeeker SET skills = ?, education = ?, experience = ?, resume_url = ?, preferred_location = ? WHERE jobseeker_id = ?`,
      [skills, education, experience, resume_url, preferred_location, jobseeker_id]
    );
    return { updated: true };
  } else {
    const [res] = await db.query(
      `INSERT INTO JobSeeker (jobseeker_id, skills, education, experience, resume_url, preferred_location) VALUES (?, ?, ?, ?, ?, ?)`,
      [jobseeker_id, skills, education, experience, resume_url, preferred_location]
    );
    return { created: true };
  }
}

module.exports = {
  getJobSeekerById,
  createJobSeekerProfile
};
