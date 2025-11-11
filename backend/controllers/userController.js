const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;
    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await createUser(full_name, email, hashed, phone, role);
    
    // Auto-create profile based on role
    const pool = require('../config/db');
    const userId = result.insertId;
    
    if (role === 'JobSeeker') {
      await pool.query(
        'INSERT INTO JobSeeker (jobseeker_id, skills, education, experience, resume_url, preferred_location) VALUES (?, "", "", "", "", "")',
        [userId]
      );
    }
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




