const { Project, User } = require('../models');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const { Readable } = require('stream');

// Helper to parse file from buffer
const parseFile = async (buffer, originalName) => {
  try {
    const ext = originalName.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      const results = [];
      return new Promise((resolve, reject) => {
        const stream = Readable.from(buffer);
        stream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            const columns = results.length > 0 ? Object.keys(results[0]) : [];
            resolve({ data: results, columns });
          })
          .on('error', (error) => {
            reject(new Error(`Failed to parse CSV file: ${error.message}`));
          });
      });
    } else if (['xlsx', 'xls'].includes(ext)) {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      return { data, columns };
    }
    throw new Error('Unsupported file format');
  } catch (err) {
    throw new Error(`File parsing error: ${err.message}`);
  }
};

// Create project controller
exports.createProject = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Parse file from buffer
    const { data, columns } = await parseFile(req.file.buffer, req.file.originalname);

    // Create project with file data
    const project = await Project.create({
      name: req.body.name || `Project-${Date.now()}`,
      user: req.user.id,
      file: {
        originalName: req.file.originalname,
        data: req.file.buffer, // Store file content as Buffer
        size: req.file.size,
        columns,
      },
    });

    // Update user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id },
    });

    res.status(201).json({
      status: 'success',
      data: {
        project: {
          ...project.toObject(),
          file: {
            originalName: project.file.originalName,
            columns: project.file.columns,
          },
        },
      },
    });
  } catch (err) {
    console.error('Error in createProject:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get file data controller
exports.getFileData = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID',
      });
    }

    if (!project.file.data) {
      return res.status(400).json({
        status: 'fail',
        message: 'No file data available for this project',
      });
    }

    const { data, columns } = await parseFile(project.file.data, project.file.originalName);

    res.status(200).json({
      status: 'success',
      data: {
        data,
        columns,
      },
    });
  } catch (err) {
    console.error('Error in getFileData:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get single project controller
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select('-file.data'); // Exclude file.data to reduce response size

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    console.error('Error in getProject:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get all projects controller
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort('-lastAccessed')
      .select('-file.data'); // Exclude file.data to reduce response size

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (err) {
    console.error('Error in getAllProjects:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Add chart to project controller
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
            dataColumn,
            color,
          },
        },
      },
      { new: true, runValidators: true, select: '-file.data' } // Exclude file.data
    );

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    console.error('Error in addChartToProject:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Delete chart controller
exports.deleteChart = async (req, res, next) => {
  try {
    const { chartId } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        $pull: { charts: { _id: chartId } },
      },
      { new: true, select: '-file.data' } // Exclude file.data
    );

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    console.error('Error in deleteChart:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Delete project controller
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID',
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { projects: project._id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.error('Error in deleteProject:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

module.exports.parseFile = parseFile;