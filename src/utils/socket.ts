import { io, Socket } from 'socket.io-client';
import { API_URL } from '@env';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket'],
    });
  }
  return socket;
};
