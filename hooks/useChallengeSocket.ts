// === prepbuddy-mobile/hooks/useChallengeSocket.ts ===
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@/lib/useUser';
import { useQueryClient } from '@tanstack/react-query';

const socket = io(process.env.EXPO_PUBLIC_API_URL!, {
  withCredentials: true,
  transports: ['websocket'],
});

export function useChallengeSocket() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?._id) return;

    socket.emit('join', user._id);

    socket.on('challenge:updated', () => {
      queryClient.invalidateQueries(['challenges']);
    });

    return () => {
      socket.off('challenge:updated');
    };
  }, [user?._id]);
}
