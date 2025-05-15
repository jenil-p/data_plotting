const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Protect all admin routes and restrict to admin role
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/users/suspended', adminController.getSuspendedUsers);
router.get('/users/blocked', adminController.getBlockedUsers);
router.patch('/users/:id/suspend', adminController.suspendUser);
router.patch('/users/:id/unsuspend', adminController.unsuspendUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/promote', adminController.promoteToAdmin);

module.exports = router;