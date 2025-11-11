// routes/jobSeekerRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/jobSeekerController');
const { verifyToken, isJobSeeker } = require('../middleware/authMiddleware');

// JobSeeker creates/updates their profile
router.post('/upsert', verifyToken, isJobSeeker, upsertProfile);

// Get jobseeker profile (public or protected as you want)
router.get('/:id', verifyToken, getProfile);

module.exports = router;
