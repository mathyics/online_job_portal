const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Stores { id, role, iat, exp }
    console.log('✅ Token verified:', { id: decoded.id, role: decoded.role });
    next();
  } catch (err) {
    console.log('❌ Invalid token:', err.message);
    res.status(403).json({ message: 'Invalid token' });
  }
}

function isJobSeeker(req, res, next) {
  console.log('Checking JobSeeker role:', req.user.role);
  if (req.user.role !== 'JobSeeker') {
    console.log('❌ Access denied - not a JobSeeker');
    return res.status(403).json({ message: 'Access denied: JobSeekers only' });
  }
  console.log('✅ JobSeeker verified');
  next();
}

function isEmployer(req, res, next) {
  if (req.user.role !== 'Employer') {
    return res.status(403).json({ message: 'Access denied: Employers only' });
  }
  next();
}

module.exports = { verifyToken, isJobSeeker, isEmployer };
