// lib/api.ts
import axios from 'axios';
import { Platform } from 'react-native'; // For potential platform-specific base URL adjustments if needed

// Ensure EXPO_PUBLIC_API_URL is set in your .env file and accessible
const baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://prepbuddy-backend.onrender.com'; // Fallback for safety

if (baseURL === 'https://prepbuddy-backend.onrender.com' && process.env.NODE_ENV !== 'production') {
    console.warn("Using fallback API URL. Ensure EXPO_PUBLIC_API_URL is set for development/preview builds.");
}


export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 15000, // Optional: add a timeout for requests
});

// TODO: Add request interceptor for auth tokens if using header-based auth
// Example:
// api.interceptors.request.use(async (config) => {
//   const token = await getAuthToken(); // Function to retrieve token from secure store / state
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


// TODO: Add response interceptor for global error handling / token refresh
// Example:
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // const newTokens = await refreshTokenFunction(); // Your token refresh logic
//         // storeNewTokens(newTokens); // Update stored tokens
//         // originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
//         // return api(originalRequest); // Retry original request
//         // For now, just logout or redirect if 401 and not handled by a specific screen
//         console.error("API Error 401 - Unauthorized. Consider implementing token refresh or redirecting to login.");
//         // getAuthStore().getState().logout(); // Example: logout from Zustand store
//         // router.replace('/auth/login');
//       } catch (refreshError) {
//         // Handle refresh token failure (e.g., logout user)
//         // getAuthStore().getState().logout();
//         // router.replace('/auth/login');
//         return Promise.reject(refreshError);
//       }
//     }
//     // Handle other errors globally if needed
//     // Example: show a generic toast for 5xx errors
//     if (error.response?.status >= 500) {
//       // Toast.show({ type: 'error', text1: 'Server Error', text2: 'An unexpected error occurred on the server.' });
//     }
//     return Promise.reject(error);
//   }
// );
