// === prepbuddy-mobile/app/_layout.tsx ===
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useChallengeInviteToast } from '@/hooks/challenges/useChallengeInviteToast'; // Updated path
import Toast from 'react-native-toast-message';
import { useDarkModeStore } from '@/hooks/useDarkModeStore';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
// Removed import for global.css as its location is unknown and might be handled by NativeWind

// Environment Variable Validation
if (!process.env.EXPO_PUBLIC_API_URL && process.env.NODE_ENV !== 'production') {
  console.warn(
    'EXPO_PUBLIC_API_URL is not set. Please create a .env file and define it. App may not connect to the backend.'
  );
  // Optionally, you could throw an error or show an alert in dev mode.
  // Alert.alert("Missing API URL", "EXPO_PUBLIC_API_URL is not set. Please configure it in .env.");
}


export default function RootLayout() {
  useChallengeInviteToast();
  const { isDark, loadPreference } = useDarkModeStore();

  useEffect(() => {
    loadPreference();
  }, [loadPreference]); // Added loadPreference to dependency array

  return (
    <View style={{ flex: 1 }} className={isDark ? 'dark bg-black' : 'bg-white'}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Toast />
    </View>
  );
}
