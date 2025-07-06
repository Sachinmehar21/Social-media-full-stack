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
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const app = express();

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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/postRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/messageRoutes"));

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = { email: payload.email, name: payload.name, sub: payload.sub };
    const jwtToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Store online users: { userId: socketId }
const onlineUsers = {};

const AI_BOT_USERNAME = 'ai_bot';
let aiBotId = null;

// Find AI bot user on startup
const User = require('./models/userModel');
(async () => {
  const bot = await User.findOne({ username: AI_BOT_USERNAME });
  if (bot) aiBotId = bot._id.toString();
})();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

// Connect to DB and start server
const PORT = process.env.PORT || 3000;

let serverInstance = null;

const startServer = async () => {
  try {
    await connectDb();
    serverInstance = server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
  }
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
