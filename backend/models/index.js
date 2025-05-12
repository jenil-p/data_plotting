const mongoose = require('mongoose');

// Import schemas and define models
const userSchema = require('./User');
const projectSchema = require('./Project');

// Define models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

module.exports = {
  User,
  Project
};