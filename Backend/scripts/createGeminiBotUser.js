const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/socialmedia';

async function createAIBotUser() {
  await mongoose.connect(MONGO_URL);
  const existing = await User.findOne({ username: 'ai_bot' });
  if (existing) {
    console.log('AI bot user already exists:', existing._id);
    await mongoose.disconnect();
    return;
  }
  const password = await bcrypt.hash('AIBotSuperSecret123!@#', 10);
  const bot = new User({
    username: 'ai_bot',
    email: 'ai@bot.com',
    password,
    bio: 'I am AI Bot, your smart assistant! Ask me anything.',
    profilepicture: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
    followers: [],
    following: [],
    posts: []
  });
  await bot.save();
  console.log('AI bot user created:', bot._id);
  await mongoose.disconnect();
}

createAIBotUser(); 