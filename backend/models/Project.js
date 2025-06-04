const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A project must have a name'],
    trim: true,
    maxlength: [50, 'Project name cannot exceed 50 characters'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file: {
    originalName: String,
    // path: String,
    data: Buffer,
    size: Number,
    columns: [String],
  },
  charts: [{
    type: {
      type: String,
      enum: ['bar', 'line', 'scatter', 'pie', 'bar3d', 'line3d', 'scatter3d', 'surface'],
      required: true,
    },
    title: String,
    xAxis: String,
    yAxis: String,
    zAxis: String,
    dataColumn: String,
    color: {
      type: String,
      default: '#4F46E5',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  chatHistory: [
    {
      message: String,
      reply: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

projectSchema.pre(/^findOne|^find$/, function(next) {
  this.set({ lastAccessed: Date.now() });
  next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;