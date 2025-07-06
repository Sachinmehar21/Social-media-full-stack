import { io } from 'socket.io-client';

// Connect to backend Socket.IO server
const socket = io('http://localhost:3000', {
  withCredentials: true,
});

export default socket;

export const API_URL = import.meta.env.VITE_API_URL; 