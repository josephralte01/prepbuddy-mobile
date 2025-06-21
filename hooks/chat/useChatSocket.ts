// === File: prepbuddy-mobile/hooks/chat/useChatSocket.ts ===
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@/hooks/user/useUser';

// Similar to Challenge socket, consider a shared socket instance if chat is used extensively.
const socketUrl = process.env.EXPO_PUBLIC_API_URL;
if (!socketUrl) {
  console.error("EXPO_PUBLIC_API_URL is not defined. Chat socket will not connect.");
}

export const useChatSocket = (onMessage: (msg: any) => void) => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id || !socketUrl) return;

    // Ensure socket is created only once or managed appropriately if hook re-runs
    if (!socketRef.current) {
        socketRef.current = io(socketUrl, {
            transports: ['websocket'],
            query: { userId: user._id },
            autoConnect: false, // Connect manually
        });
    }

    const socket = socketRef.current;

    if (!socket.connected) {
        socket.connect();
    }

    socket.on('connect', () => {
      console.log(`🟢 Chat socket connected for user: ${user._id}`);
    });

    socket.on('chat:message', (message) => {
      onMessage(message);
    });

    socket.on('disconnect', (reason) => {
        console.log(`🔴 Chat socket disconnected for user: ${user._id}, reason: ${reason}`);
    });

    socket.on('connect_error', (err) => {
        console.error(`Chat socket connection error for user ${user._id}:`, err.message);
    });


    return () => {
      if (socket) {
        console.log(`🔌 Disconnecting chat socket for user: ${user._id}`);
        socket.off('connect');
        socket.off('chat:message');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.disconnect();
        socketRef.current = null; // Clear ref on cleanup if socket is per-instance
      }
    };
  }, [user?._id, onMessage]); // Added onMessage to dependency array

  const sendMessage = (recipientId: string, content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:send', { recipientId, content });
    } else {
      console.warn("Chat socket not connected. Message not sent.");
      // Optionally, queue message or attempt reconnect
    }
  };

  return { sendMessage };
};
