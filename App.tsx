// App.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDarkModeStore } from './hooks/useDarkModeStore';
import { View } from 'react-native';
import './global.css';

export default function App() {
  const { isDark, loadPreference } = useDarkModeStore();

  useEffect(() => {
    loadPreference();
  }, []);

  return (
    <View className={`flex-1 ${isDark ? 'dark bg-black' : 'bg-white'}`}>
      <Stack />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
