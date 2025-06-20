// components/DarkModeToggle.tsx
import { View, Text, Switch } from 'react-native';
import { useDarkModeStore } from '../hooks/useDarkModeStore';

export default function DarkModeToggle() {
  const { isDark, toggleDark } = useDarkModeStore();

  return (
    <View className="flex-row items-center gap-3 p-4">
      <Text className="text-base text-gray-800 dark:text-white">Dark Mode</Text>
      <Switch value={isDark} onValueChange={toggleDark} />
    </View>
  );
}
