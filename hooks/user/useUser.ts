import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store'; // Adjusted path for store
import { api } from '@/lib/api'; // Adjusted path for api

export const useUser = () => {
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      api.get('/auth/me', { withCredentials: true }) // Removed /api prefix, assuming it's in baseURL
        .then(res => setUser(res.data))
        .catch(() => {
          // console.error("Failed to fetch user or session expired:", err); // Optional: log specific error
          logout();
        });
    }
  }, [user, setUser, logout]); // Added dependencies to useEffect

  return { user, setUser, logout };
};
