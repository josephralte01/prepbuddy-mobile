// app/settings/index.tsx
import { View, Text, ScrollView } from 'react-native';
import DarkModeToggle from '@/components/DarkModeToggle'; // Adjusted path

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-black p-4">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Settings
      </Text>
      <DarkModeToggle />
      {/* Add more settings options below */}
    </ScrollView>
  );
}
