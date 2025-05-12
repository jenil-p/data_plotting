const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');
const hpp = require('hpp');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES,
  NODE_ENV: process.env.NODE_ENV,
});

// Initialize Express app
const app = express();

// Middleware to sanitize MongoDB inputs
const sanitizeMongo = (req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  }
  next();
};

// Middleware to sanitize XSS
const sanitizeXSS = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (typeof value === 'string') {
        acc[key] = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
      } else if (typeof value === 'object') {
        acc[key] = sanitizeObject(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

// Middleware to prevent HTTP Parameter Pollution
const hppMiddleware = (req, res, next) => {
  req.query = req.query;
  hpp()(req, res, next);
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(sanitizeMongo);
app.use(sanitizeXSS);
app.use(hppMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  next();
});

// Routes
console.log('Mounting auth routes');
app.use('/api/v1/auth', authRoutes);
console.log('Mounting project routes');
app.use('/api/v1/projects', projectRoutes);
console.log('Mounting user routes');
app.use('/api/v1/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error middleware:', err.message, err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server',
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});