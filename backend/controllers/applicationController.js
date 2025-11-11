const {
  applyToJob,
  getApplicationsByJobseeker,
  getApplicationsByJob,
  updateApplicationStatus
} = require('../models/applicationModel');

// Job Seeker applies for a job
exports.submitApplication = async (req, res) => {
  try {
    const { job_id, jobseeker_id, cover_letter, resume_url } = req.body;
    console.log('Application request:', { job_id, jobseeker_id, cover_letter, resume_url });
    
    if (!job_id || !jobseeker_id) {
      return res.status(400).json({ message: "job_id and jobseeker_id are required" });
    }
    
    await applyToJob(job_id, jobseeker_id, cover_letter, resume_url);
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error('Application error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: "You already applied to this job" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Job Seeker views all their applications
exports.listMyApplications = async (req, res) => {
  try {
    const { jobseeker_id } = req.params;
    const applications = await getApplicationsByJobseeker(jobseeker_id);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Employer views all applicants for their job
exports.listApplicantsForJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const applicants = await getApplicationsByJob(job_id);
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Employer updates applicant status
exports.updateStatus = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { status } = req.body;
    await updateApplicationStatus(application_id, status);
    res.json({ message: "Application status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
