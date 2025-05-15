const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAbout) // Public route to fetch About data
  .patch(protect, admin, updateAbout); // Protected route for admins to update About data

module.exports = router;