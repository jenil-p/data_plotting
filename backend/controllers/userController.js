const { User } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlink = promisify(fs.unlink);

// Configure multer for profile pictures
const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pics/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
  }
});

const profilePicUpload = multer({
  storage: profilePicStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPEG, JPG, PNG) are allowed!'));
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
}).single('profilePicture');

exports.uploadProfilePicture = (req, res, next) => {
  profilePicUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }

    try {
      const user = await User.findById(req.user.id);
      
      // Delete old profile picture if it exists and isn't the default
      if (user.profilePicture && user.profilePicture !== 'default.jpg') {
        try {
          await unlink(`uploads/profile_pics/${user.profilePicture}`);
        } catch (err) {
          console.error('Error deleting old profile picture:', err);
        }
      }

      // Update user with new profile picture filename
      user.profilePicture = req.file.filename;
      await user.save();

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            username: user.username,
            profilePicture: user.profilePicture
          }
        }
      });
    } catch (err) {
      if (req.file) await unlink(req.file.path); // Clean up if error occurs
      next(err);
    }
  });
};

exports.updateUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          profilePicture: user.profilePicture
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    console.log('getMe request for user:', req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    console.error('getMe error:', err.message);
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};