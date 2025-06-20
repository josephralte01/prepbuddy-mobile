// === prepbuddy-mobile/hooks/useChallengeInviteToast.ts ===
import { useEffect } from 'react';
import { useSocket } from '@/lib/socket';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export function useChallengeInviteToast() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleInvite = ({ from, challengeId }: { from: string; challengeId: string }) => {
      Toast.show({
        type: 'info',
        text1: '🔥 New Challenge Invite!',
        text2: `You’ve been challenged. Tap to view.`,
        onPress: () => router.push(`/challenges/${challengeId}`),
        autoHide: true,
        visibilityTime: 5000,
      });
    };

    socket.on('challenge:invited', handleInvite);
    return () => {
      socket.off('challenge:invited', handleInvite);
    };
  }, [socket]);
}
