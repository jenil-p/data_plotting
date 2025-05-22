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