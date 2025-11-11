const { postJob, getOpenJobs, getJobsByEmployer } = require('../models/jobModel');

const pool = require('../config/db');

exports.createJob = async (req, res) => {
  try {
    const employer_id = req.user.id;
    let { category_id, category_name, title, description, skills_required, location, salary, deadline } = req.body;

    // ✅ if category_id not provided, find from category_name
    if (!category_id && category_name) {
      const [rows] = await pool.query("SELECT category_id FROM JobCategory WHERE category_name = ?", [category_name]);
      if (rows.length === 0) {
        return res.status(400).json({ message: "Invalid category name" });
      }
      category_id = rows[0].category_id;
    }

    // Still missing both? error.
    if (!category_id) {
      return res.status(400).json({ message: "category_id or category_name required" });
    }

    // Insert job
    await pool.query(
      `INSERT INTO Jobs (employer_id, category_id, title, description, skills_required, location, salary, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [employer_id, category_id, title, description, skills_required, location, salary, deadline]
    );

    res.json({ message: "Job posted successfully" });
  } catch (error) {
    console.error("Error posting job:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.listOpenJobs = async (req, res) => {
  try {
    const { category_id } = req.query;
    const jobs = await getOpenJobs(category_id);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listMyJobs = async (req, res) => {
  try {
    const { employer_id } = req.params;
    const jobs = await getJobsByEmployer(employer_id);
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching employer jobs:', err);
    res.status(500).json({ error: err.message });
  }
};
