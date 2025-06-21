// === prepbuddy-mobile/hooks/challenges/useChallengeInviteToast.ts ===
import { useEffect } from 'react';
import { useSocket } from '@/lib/socket'; // Assuming this is a general socket context/hook
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export function useChallengeInviteToast() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleInvite = ({ from, challengeId }: { from: string; challengeId: string }) => {
      Toast.show({
        type: 'info', // Consider a custom type for challenges if more styling is needed
        text1: '🔥 New Challenge Invite!',
        text2: `From @${from || 'User'}. Tap to view.`, // Added 'from' user if available
        props: {
            // Custom props if needed for styling Toast
            // Eg: challengeId: challengeId
        },
        onPress: () => router.push(`/challenges/${challengeId}`), // Ensure this route exists
        visibilityTime: 7000, // Increased visibility
        autoHide: true,
      });
    };

    socket.on('challenge:invited', handleInvite);

    // Clean up the listener when the hook unmounts or socket changes
    return () => {
      socket.off('challenge:invited', handleInvite);
    };
  }, [socket]); // Dependency array includes socket
}
