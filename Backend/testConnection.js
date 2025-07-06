const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGO_URL:', process.env.MONGO_URL || 'Not set in .env');
    
    const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://102001ayushdubey:sachin-bhai@cluster0.7nqspsv.mongodb.net/';
    
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('Connection closed.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify your connection string is correct');
    console.log('3. Ensure your network connection is stable');
    console.log('4. Check if MongoDB Atlas cluster is running');
  }
}

testConnection(); 