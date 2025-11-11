const express = require('express');
const { verifyToken, isEmployer } = require('../middleware/authMiddleware');
const { createOrUpdateEmployer, getEmployerProfile } = require('../controllers/employerController');

const router = express.Router();

// Employer creates or updates profile
router.post('/create', verifyToken, isEmployer, createOrUpdateEmployer);

// Employer fetches their profile
router.get('/:id', verifyToken, isEmployer, getEmployerProfile);

module.exports = router;
