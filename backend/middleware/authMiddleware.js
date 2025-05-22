const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Middleware to verify JWT token and attach user to req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || jwtConfig.secret);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Not authorized, user not found',
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, token failed',
      });
    }
  } else {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized, no token',
    });
  }
});

// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

// Middleware to restrict access to admins only
const admin = restrictTo('admin');

module.exports = { protect, admin, restrictTo };