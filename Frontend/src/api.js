import axios from 'axios';
import { io } from 'socket.io-client';

export const API_URL = import.meta.env.VITE_API_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Socket.IO instance
export const socket = io(API_URL, {
  withCredentials: true,
});

export default api;
