const express = require('express');
const { createJob, listOpenJobs, listMyJobs } = require('../controllers/jobController');
const { verifyToken, isEmployer } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', verifyToken, isEmployer, createJob);
router.get('/open', listOpenJobs);
router.get('/my/:employer_id', verifyToken, isEmployer, listMyJobs);

module.exports = router;
