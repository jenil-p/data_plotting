// backend/routes/openai.js
const express = require('express');
const OpenAI = require('openai');
const { Project } = require('../models');
require('dotenv').config();
const authController = require('../controllers/authController');

const router = express.Router();

console.log('XAI_API_KEY loaded:', !!process.env.XAI_API_KEY, 'First 10 chars:', process.env.XAI_API_KEY?.slice(0, 10));

// Initialize OpenAI client for Grok API
const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY, // Use Grok API key
  baseURL: 'https://api.x.ai/v1', // Grok API base URL
});


// Protect the route
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

    // Parse file data
    const { parseFile } = require('../controllers/projectController');
    const { data, columns } = await parseFile(project.file.path, project.file.originalName);

    // Prepare context for Grok
    const context = `
      You are an AI assistant analyzing a dataset uploaded by the user. The dataset has the following columns: ${columns.join(', ')}.
      The data contains ${data.length} rows. Here is a sample of the data (first 5 rows or less if fewer rows exist):
      ${JSON.stringify(data.slice(0, 5), null, 2)}
      
      The user has provided the following prompt: "${message}"
      
      Provide a concise and accurate response based on the dataset and the user's prompt. If the prompt requires data analysis, summarize the relevant information or trends from the dataset. Avoid generating code unless explicitly requested.
    `;

    const response = await openai.chat.completions.create({
      model: 'grok-beta', // Use Grok model (e.g., grok-beta, grok-2-1212)
      messages: [
        {
          role: 'system',
          content:
            'You are Grok, a data analysis assistant. Provide clear, concise, and accurate responses based on the provided dataset and user prompt. Focus on summarizing data, identifying trends, or answering specific questions about the dataset.',
        },
        { role: 'user', content: context },
      ],
      max_tokens: 200, // Reduced to conserve credits
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({
      status: 'success',
      data: { reply },
    });
  } catch (err) {
    console.error('Grok API error:', {
      message: err.message,
      stack: err.stack,
      responseData: err.response?.data,
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Grok response',
      errorDetails: err.message,
    });
  }
});

// Test route for Grok API
router.get('/test-grok', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'grok-beta',
      messages: [{ role: 'user', content: 'Hello, this is a test.' }],
      max_tokens: 50,
    });
    res.status(200).json({
      status: 'success',
      data: { reply: response.choices[0].message.content },
    });
  } catch (err) {
    console.error('Test Grok error:', {
      message: err.message,
      stack: err.stack,
      responseData: err.response?.data,
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to test Grok API',
      errorDetails: err.message,
    });
  }
});

module.exports = router;