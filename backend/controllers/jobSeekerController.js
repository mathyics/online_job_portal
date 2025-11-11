// controllers/jobSeekerController.js
const { getJobSeekerById, createJobSeekerProfile } = require('../models/jobSeekerModel');

// Get profile (jobseeker can view own profile; admin/employer view optional)
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params; // jobseeker_id
    const profile = await getJobSeekerById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update profile
exports.upsertProfile = async (req, res) => {
  try {
    // If you enforce auth, use req.user.id instead of body.jobseeker_id
    const { jobseeker_id, skills, education, experience, resume_url, preferred_location } = req.body;
    if (!jobseeker_id) return res.status(400).json({ message: 'jobseeker_id required' });

    const result = await createJobSeekerProfile(jobseeker_id, skills, education, experience, resume_url, preferred_location);
    res.json({ message: result.created ? 'Profile created' : 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
