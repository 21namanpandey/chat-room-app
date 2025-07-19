import { API_URL } from '@env';
import { Room } from '../types';

export const getRooms = async (): Promise<Room[]> => {
const response = await fetch(`${API_URL}/api/rooms`);
if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }
  return response.json();
};

export const createRoom = async (name: string): Promise<Room> => {
  const response = await fetch(`${API_URL}/api/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create room');
  }
  return data;
};