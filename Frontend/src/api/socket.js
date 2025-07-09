import { io } from 'socket.io-client';
import { API_URL } from './axios';

export const socket = io(API_URL, {
  withCredentials: true,
}); 