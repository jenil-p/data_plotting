const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/update-username', userController.updateUsername);
router.patch('/update-password', userController.updatePassword);

module.exports = router;