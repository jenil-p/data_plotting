const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');
const fileUpload = require('../utils/fileUpload');

console.log('projectController imported:', Object.keys(projectController));

const router = express.Router();

router.use(authController.protect);

router.route('/')
  .post(fileUpload.single('file'), projectController.createProject)
  .get(projectController.getAllProjects);

router.route('/:id')
  .get(projectController.getProject)
  .delete(projectController.deleteProject);

router.route('/:id/charts')
  .post(projectController.addChartToProject);

module.exports = router;