const mongoose = require('mongoose');
require('dotenv').config();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

const connectDb = async () => {
  const MAX_RETRIES = 3;
  const RETRY_INTERVAL = 5000; // 5 seconds
  let retries = 0;

  const tryConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        dbName: 'social_media',
        maxPoolSize: 10,
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 2000
      });
    } catch (err) {
      console.error('MongoDB connection error:', err);
      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Retrying connection (${retries}/${MAX_RETRIES}) in ${RETRY_INTERVAL/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        return tryConnect();
      }
      process.exit(1);
    }
  };

  await tryConnect();
};

module.exports = connectDb;
