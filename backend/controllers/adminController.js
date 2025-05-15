const { User, Project } = require('../models');
const { promisify } = require('util');
const unlink = promisify(require('fs').unlink);

// Get all users with project counts
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('projects', 'name');
    const userData = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      projectsCount: user.projects.length,
      status: user.status,
      role: user.role,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        users: userData,
      },
    });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
};

// Get suspended users
exports.getSuspendedUsers = async (req, res, next) => {
  try {
    const users = await User.find({ status: 'suspended' }).populate('projects', 'name');
    const userData = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      projectsCount: user.projects.length,
      status: user.status,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        users: userData,
      },
    });
  } catch (err) {
    console.error('Error fetching suspended users:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch suspended users',
    });
  }
};

// Get blocked users
exports.getBlockedUsers = async (req, res, next) => {
  try {
    const users = await User.find({ status: 'blocked' });
    const userData = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      projectsCount: 0, // Projects are deleted for blocked users
      status: user.status,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        users: userData,
      },
    });
  } catch (err) {
    console.error('Error fetching blocked users:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blocked users',
    });
  }
};

// Suspend a user
exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    if (user.status === 'suspended') {
      return res.status(400).json({
        status: 'fail',
        message: 'User is already suspended',
      });
    }
    user.status = 'suspended';
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User suspended successfully',
    });
  } catch (err) {
    console.error('Error suspending user:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to suspend user',
    });
  }
};

// Unsuspend a user
exports.unsuspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    if (user.status !== 'suspended') {
      return res.status(400).json({
        status: 'fail',
        message: 'User is not suspended',
      });
    }
    user.status = 'active';
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User unsuspended successfully',
    });
  } catch (err) {
    console.error('Error unsuspending user:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to unsuspend user',
    });
  }
};

// Delete a user (permanently block and delete projects)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    if (user.status === 'blocked') {
      return res.status(400).json({
        status: 'fail',
        message: 'User is already blocked',
      });
    }

    // Fetch projects to delete associated files
    const projects = await Project.find({ user: user._id });
    for (const project of projects) {
      if (project.file?.path) {
        try {
          await unlink(project.file.path);
        } catch (err) {
          console.error('Error deleting project file:', err);
        }
      }
    }

    // Delete all projects associated with the user
    await Project.deleteMany({ user: user._id });

    // Mark user as blocked
    user.status = 'blocked';
    user.projects = [];
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User deleted and marked as permanently blocked',
    });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user',
    });
  }
};

// Promote a user to admin
exports.promoteToAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    if (user.role === 'admin') {
      return res.status(400).json({
        status: 'fail',
        message: 'User is already an admin',
      });
    }
    user.role = 'admin';
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User promoted to admin successfully',
    });
  } catch (err) {
    console.error('Error promoting user to admin:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to promote user to admin',
    });
  }
};