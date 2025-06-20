import { useEffect } from 'react';
import { useAuthStore } from './store';
import { api } from './api';

export const useUser = () => {
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      api.get('/api/auth/me', { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  return { user, setUser, logout };
};
