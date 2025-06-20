// === File: prepbuddy-mobile/hooks/useChatSocket.ts ===
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@/lib/useUser';

export const useChatSocket = (onMessage: (msg: any) => void) => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(process.env.EXPO_PUBLIC_API_URL as string, {
      transports: ['websocket'],
      query: { userId: user._id },
    });

    socket.on('connect', () => {
      console.log('🟢 Connected to socket.io');
    });

    socket.on('chat:message', (message) => {
      onMessage(message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const sendMessage = (recipientId: string, content: string) => {
    socketRef.current?.emit('chat:send', { recipientId, content });
  };

  return { sendMessage };
};
