const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  
  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'strict'
  };

  // Send both cookie and response body
  res.cookie('jwt', token, cookieOptions);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token, // Also send token in response body
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    console.log('Signup request:', req.body);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error('Incorrect email or password');
    }
    console.log('Login successful:', { email });
    createSendToken(user, 200, req, res);
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    // 1) Check headers first
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // 2) Then check cookies
    else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 3) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // 4) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    // 5) Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Protect middleware error:', err.message);
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};