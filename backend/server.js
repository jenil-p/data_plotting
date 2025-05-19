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
const adminRoutes = require('./routes/adminRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const openaiRoutes = require('./routes/openai')

dotenv.config();
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES,
  NODE_ENV: process.env.NODE_ENV,
});

const app = express();

const sanitizeMongo = (req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  }
  next();
};

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

const hppMiddleware = (req, res, next) => {
  req.query = req.query;
  hpp()(req, res, next);
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(sanitizeMongo);
app.use(sanitizeXSS);
app.use(hppMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  next();
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/about', aboutRoutes);
app.use('/api', openaiRoutes);

app.use((err, req, res, next) => {
  console.error('Error middleware:', err.message, err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server',
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});