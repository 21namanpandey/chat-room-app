import { API_URL } from '@env';
import { Message } from '../types';

export const getRoomMessages = async (roomId: string): Promise<Message[]> => {
const response = await fetch(`${API_URL}/api/messages/${roomId}`);
if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};