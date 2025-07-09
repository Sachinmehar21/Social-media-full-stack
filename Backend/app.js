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

// DEBUG: Check Mongo URL
console.log("MONGO_URL from .env:", process.env.MONGO_URL);

// CORS setup for dev + Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "https://social-media-full-stack-n79t.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Basic config
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/postRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/messageRoutes"));

// 404 fallback for unknown routes
app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// HTTP + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Store online users
const onlineUsers = {};
const AI_BOT_USERNAME = 'ai_bot';
let aiBotId = null;

const User = require('./models/userModel');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} joined. Online users:`, onlineUsers);
  });

  socket.on('dm', async ({ toUserId, fromUserId, message }) => {
    const toSocketId = onlineUsers[toUserId];

    try {
      await Message.create({ from: fromUserId, to: toUserId, text: message });
    } catch (err) {
      console.error('Failed to save message:', err);
    }

    if (aiBotId && toUserId === aiBotId) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const parts = [{ text: message.trim() }];
        const result = await model.generateContent(parts);
        const response = await result.response;
        const aiReply = response.text();

        await Message.create({ from: aiBotId, to: fromUserId, text: aiReply });

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

    if (toSocketId) {
      io.to(toSocketId).emit('dm', { fromUserId, message });
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, sId] of Object.entries(onlineUsers)) {
      if (sId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log('A user disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;

connectDb().then(async () => {
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
