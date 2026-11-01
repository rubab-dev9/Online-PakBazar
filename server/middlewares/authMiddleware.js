const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Protect Middleware
const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please login.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this token.'
      });
    }

    req.user = user;
    next(); // required to move route next after this middleware

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

// Authorize Role Middleware
const authorizeRole = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Role is not authorized!'
      });
    }

    next(); // required to move route next after this middleware
  };
};

module.exports = { protect, authorizeRole };