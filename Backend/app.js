const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDb = require("./config/db.js");
const path = require('path');
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

console.log("MONGO_URL from .env:", process.env.MONGO_URL);

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/postRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/messageRoutes"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://social-media-full-stack-k8mq.vercel.app"
    ],
    credentials: true
  }
});

// Store online users: { userId: socketId }
const onlineUsers = {};

const AI_BOT_USERNAME = 'ai_bot';
let aiBotId = null;

// Find AI bot user after DB connection
const User = require('./models/userModel');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // User joins with their userId
  socket.on('join', (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} joined. Online users:`, onlineUsers);
  });

  // Handle direct message
  socket.on('dm', async ({ toUserId, fromUserId, message }) => {
    const toSocketId = onlineUsers[toUserId];
    // Save user message to DB
    try {
      await Message.create({ from: fromUserId, to: toUserId, text: message });
    } catch (err) {
      console.error('Failed to save message:', err);
    }
    // If recipient is AI bot, call Gemini API and reply
    if (aiBotId && toUserId === aiBotId) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const parts = [{ text: message.trim() }];
        const result = await model.generateContent(parts);
        const response = await result.response;
        const aiReply = response.text();
        // Save bot reply to DB
        await Message.create({ from: aiBotId, to: fromUserId, text: aiReply });
        // Emit bot reply to user
        const fromSocketId = onlineUsers[fromUserId];
        if (fromSocketId) {
          io.to(fromSocketId).emit('dm', { fromUserId: aiBotId, message: aiReply });
        }
      } catch (err) {
        console.error('Gemini API error:', err.message);
        const fromSocketId = onlineUsers[fromUserId];
        if (fromSocketId) {
          io.to(fromSocketId).emit('dm', { fromUserId: aiBotId, message: 'Sorry, AI Bot is unavailable.' });
        }
      }
      return;
    }
    // Normal user-to-user DM
    if (toSocketId) {
      io.to(toSocketId).emit('dm', { fromUserId, message });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove user from onlineUsers
    for (const [userId, sId] of Object.entries(onlineUsers)) {
      if (sId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log('A user disconnected:', socket.id);
  });
});

// Connect to DB and start server
const PORT = process.env.PORT || 3000;

connectDb().then(async () => {
  // Find AI bot user after DB connection is established
  try {
    const bot = await User.findOne({ username: AI_BOT_USERNAME });
    if (bot) aiBotId = bot._id.toString();
    console.log('AI Bot ID:', aiBotId);
  } catch (err) {
    console.error('Error finding AI bot user:', err);
  }
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
