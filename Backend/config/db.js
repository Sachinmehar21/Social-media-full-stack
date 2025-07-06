const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Please check:');
    console.log('1. Your IP address is whitelisted in MongoDB Atlas');
    console.log('2. Your MongoDB connection string is correct');
    console.log('3. Your network connection is stable');
    process.exit(1);
  }
};

module.exports = connectDb;
