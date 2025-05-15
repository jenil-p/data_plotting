const { Project, User } = require('../models');
const { promisify } = require('util');
const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

// Helper to parse uploaded file
const parseFile = async (filePath, originalName) => {
  console.log('Parsing file:', { filePath, originalName });
  const ext = originalName.split('.').pop().toLowerCase();
  
  if (ext === 'csv') {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const columns = results.length > 0 ? Object.keys(results[0]) : [];
          resolve({ data: results, columns });
        })
        .on('error', reject);
    });
  } else if (['xlsx', 'xls'].includes(ext)) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    return { data, columns };
  }
  throw new Error('Unsupported file format');
};

// Update createProject controller
exports.createProject = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Parse file
    const { data, columns } = await parseFile(req.file.path, req.file.originalname);

    // Create project
    const project = await Project.create({
      name: req.body.name || `Project-${Date.now()}`,
      user: req.user.id,
      file: {
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        columns
      }
    });

    // Update user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id }
    });

    res.status(201).json({
      status: 'success',
      data: {
        project: {
          ...project.toObject(),
          file: {
            originalName: project.file.originalName,
            columns: project.file.columns
          }
        }
      }
    });

  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      await unlink(req.file.path).catch(console.error);
    }
    
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getFileData = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID'
      });
    }

    console.log('Reading file for project:', project.file);
    const { data, columns } = await parseFile(project.file.path, project.file.originalName);
    console.log('File parsed successfully, data length:', data.length, 'columns:', columns);

    res.status(200).json({
      status: 'success',
      data: {
        data,
        columns
      }
    });
  } catch (err) {
    console.error('Error in getFileData:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// (rest of the file remains unchanged)
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort('-lastAccessed')
      .select('-file.path');

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.addChartToProject = async (req, res, next) => {
  try {
    const { type, title, xAxis, yAxis, zAxis, dataColumn, color } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        $push: {
          charts: {
            type,
            title: title || `${type} Chart`,
            xAxis,
            yAxis,
            zAxis,
            dataColumn, // Add dataColumn for pie charts
            color
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteChart = async (req, res, next) => {
  try {
    const { chartId } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        $pull: { charts: { _id: chartId } }
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    console.error('Error deleting chart:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID'
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { projects: project._id }
    });

    if (project.file.path) {
      try {
        await unlink(project.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

console.log('projectController exports:', Object.keys(module.exports));