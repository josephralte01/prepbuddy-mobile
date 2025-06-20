// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://prepbuddy-backend.onrender.com',
  withCredentials: true, // use cookies for auth if needed
});
