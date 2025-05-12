const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://jenilsakariya:wuldu2FQnslbPjM8@cluster0.xeuswyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;