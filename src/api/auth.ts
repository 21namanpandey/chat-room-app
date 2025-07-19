import { API_URL } from '@env';
import { User } from '../types';

export const registerUser = async (username: string, password?: string): Promise<User> => {
const response = await fetch(`${API_URL}/api/auth/register`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
};

export const loginUser = async (username: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
};