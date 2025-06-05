const { User } = require('../models');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('projects', 'name');
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
        },
      },
    });
  } catch (err) {
    console.error('Error updating username:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      throw new Error('Both password and confirm password are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    user.password = password; // Password will be hashed by the pre-save middleware
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error('Error updating password:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};