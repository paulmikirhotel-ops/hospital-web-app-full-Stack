const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Login required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid session' });
  }
};

// ── Optional token — passes through even if no token (for public AI routes) ──
const optionalToken = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch { req.user = null; }
  } else {
    req.user = null;
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
};

// ── Doctor must be approved to access doctor routes ──
const isApprovedDoctor = async (req, res, next) => {
  try {
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    if (doctor.isApproved !== 'approved') {
      return res.status(403).json({
        success: false,
        message: doctor.isApproved === 'pending'
          ? 'Your account is pending admin approval. Please wait.'
          : 'Your account has been cancelled. Contact admin.',
      });
    }
    req.doctor = doctor;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { verifyToken, optionalToken, isAdmin, isApprovedDoctor };