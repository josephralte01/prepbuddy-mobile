// === prepbuddy-mobile/hooks/challenges/useChallengeSocket.ts ===
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@/hooks/user/useUser';
import { useQueryClient } from '@tanstack/react-query';

// It might be better to initialize the socket in a context or a singleton service
// rather than creating a new connection instance here if this hook is used in multiple places.
// For now, assuming this is the primary place or it's managed.
const socketUrl = process.env.EXPO_PUBLIC_API_URL;
if (!socketUrl) {
  console.error("EXPO_PUBLIC_API_URL is not defined. Challenge socket will not connect.");
}

const socket = socketUrl ? io(socketUrl, {
  withCredentials: true,
  transports: ['websocket'],
  autoConnect: false, // To connect manually after user is available
}) : null;

export function useChallengeSocket() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?._id || !socket) {
      return;
    }

    if (!socket.connected) {
        socket.connect();
    }

    socket.emit('join', user._id); // Join a room specific to the user for challenge updates

    const handleChallengeUpdate = (data: any) => { // Define type for data if known
      console.log('Challenge updated event received:', data);
      // Invalidate queries related to challenges to refetch data
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge', data?.challengeId] }); // If individual challenge queries exist
    };

    socket.on('challenge:updated', handleChallengeUpdate);

    // Clean up the listener and potentially disconnect if user logs out or component unmounts
    return () => {
      socket.off('challenge:updated', handleChallengeUpdate);
      // Consider if socket should disconnect when hook unmounts or user logs out
      // This depends on whether other parts of app use the same socket instance.
      // If this hook is the sole manager of this socket connection for challenges:
      // if (socket.connected) {
      //   socket.disconnect();
      // }
    };
  }, [user?._id, queryClient]); // Added queryClient to dependencies
}
