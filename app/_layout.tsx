// === prepbuddy-mobile/app/_layout.tsx ===
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useChallengeInviteToast } from '@/hooks/useChallengeInviteToast';
import Toast from 'react-native-toast-message';

export default function Layout() {
  useChallengeInviteToast();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}
