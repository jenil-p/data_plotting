const asyncHandler = require('express-async-handler');
const About = require('../models/About');

// @desc    Get About data
// @route   GET /api/about
// @access  Public
const getAbout = asyncHandler(async (req, res) => {
  let about = await About.findOne();
  
  if (!about) {
    about = await About.create({
      mission: 'PlotPilot was created to simplify data visualization for everyone. We believe that powerful insights should be accessible without requiring complex tools or technical expertise.',
      team: [
        { name: 'John Doe', role: 'Founder & CEO', initials: 'JD' },
        { name: 'Alice Smith', role: 'Lead Developer', initials: 'AS' },
        { name: 'Robert Johnson', role: 'Data Scientist', initials: 'RJ' },
      ],
      contact: {
        email: 'support@plotpilot.com',
        phone: '(123) 456-7890',
        address: '123 Data Street, Visualization City, DV 12345',
      },
    });
  }

  res.status(200).json({
    success: true,
    data: about,
  });
});

// @desc    Update About data
// @route   PATCH /api/about
// @access  Private/Admin
const updateAbout = asyncHandler(async (req, res) => {
  const { mission, team, contact } = req.body;

  if (!mission || !team || !contact) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  let about = await About.findOne();

  if (!about) {
    about = await About.create({
      mission,
      team,
      contact,
    });
  } else {
    about.mission = mission;
    about.team = team;
    about.contact = contact;
    await about.save();
  }

  res.status(200).json({
    success: true,
    data: about,
  });
});

module.exports = { getAbout, updateAbout };