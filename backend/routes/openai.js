const express = require('express');
const Together = require('together-ai');
const { Project } = require('../models');
require('dotenv').config();
const authController = require('../controllers/authController');

const router = express.Router();

const together = new Together();

router.use(authController.protect);

router.post('/chat', async (req, res) => {
  const { message, projectId } = req.body;

  if (!message || !projectId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Message and projectId are required',
    });
  }

  try {
    // Fetch project data
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID',
      });
    }

    // Check for cached response
    const cachedResponse = project.chatHistory.find(
      (entry) => entry.message === message
    );
    if (cachedResponse) {
      return res.status(200).json({
        status: 'success',
        data: { reply: cachedResponse.reply },
      });
    }

    // Validate file data
    if (!project.file?.data) {
      return res.status(400).json({
        status: 'fail',
        message: 'No file data available for this project',
      });
    }

    // Parse file data
    const { parseFile } = require('../controllers/projectController');
    const { data, columns } = await parseFile(project.file.data, project.file.originalName);

    // Check if data is empty
    if (!data || data.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'The uploaded file is empty or contains no valid data',
      });
    }

    // Prepare context for Together AI
    const context = `
      You are an AI assistant analyzing a dataset uploaded by the user. The dataset has the following columns: ${columns.join(', ')}.
      The data contains ${data.length} rows. Here is a sample of the data (first 3 rows or less if fewer rows exist):
      ${JSON.stringify(data.slice(0, 3), null, 2)}
      
      The user has provided the following prompt: "${message}"
      
      Provide a concise and accurate response based on the dataset and the user's prompt. If the prompt requires data analysis, summarize the relevant information or trends from the dataset. Avoid generating code unless explicitly requested.
    `;

    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a data analysis assistant. Provide clear, concise, and accurate responses based on the provided dataset and user prompt. Focus on summarizing data, identifying trends, or answering specific questions about the dataset.',
        },
        { role: 'user', content: context },
      ],
      model: 'deepseek-ai/DeepSeek-V3',
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    // Cache the response
    project.chatHistory.push({ message, reply });
    await project.save();

    res.status(200).json({
      status: 'success',
      data: { reply },
    });
  } catch (err) {
    console.error('Together AI API error:', {
      message: err.message,
      stack: err.stack,
      responseData: err.response?.data,
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch AI response',
      errorDetails: err.message,
    });
  }
});

// Test route for Together AI
router.get('/test-together', async (req, res) => {
  try {
    const response = await together.chat.completions.create({
      messages: [
        { role: 'user', content: 'Hello, this is a test.' },
      ],
      model: 'deepseek-ai/DeepSeek-V3',
      max_tokens: 50,
    });
    res.status(200).json({
      status: 'success',
      data: { reply: response.choices[0].message.content },
    });
  } catch (err) {
    console.error('Test Together AI error:', {
      message: err.message,
      stack: err.stack,
      responseData: err.response?.data,
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to test Together AI API',
      errorDetails: err.message,
    });
  }
});

module.exports = router;