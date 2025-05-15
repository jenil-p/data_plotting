const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  mission: {
    type: String,
    required: true,
  },
  team: [
    {
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      initials: {
        type: String,
        required: true,
        maxLength: 2,
      },
    },
  ],
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);