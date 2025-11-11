const express = require('express');
const {
  submitApplication,
  listMyApplications,
  listApplicantsForJob,
  updateStatus
} = require('../controllers/applicationController');

const { verifyToken, isJobSeeker, isEmployer } = require('../middleware/authMiddleware');
const router = express.Router();

// Job Seeker: apply to job
router.post('/apply', verifyToken, isJobSeeker, submitApplication);

// Job Seeker: view their own applications
router.get('/my/:jobseeker_id', verifyToken, isJobSeeker, listMyApplications);

// Employer: view applicants for a job
router.get('/job/:job_id', verifyToken, isEmployer, listApplicantsForJob);

// Employer: update applicant status
router.put('/update/:application_id', verifyToken, isEmployer, updateStatus);

module.exports = router;
