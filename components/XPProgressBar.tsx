import React from 'react';
import { View, Text } from 'react-native';

export default function XPProgressBar({ xp }: { xp: number }) {
  const level = Math.floor(xp / 100);
  const currentXP = xp % 100;

  return (
    <View className="w-full mt-4">
      <View className="bg-gray-300 dark:bg-gray-700 h-3 rounded-full">
        <View
          className="bg-blue-500 h-3 rounded-full"
          style={{ width: `${(currentXP / 100) * 100}%` }}
        />
      </View>
      <Text className="text-xs text-center mt-1 text-gray-700 dark:text-gray-300">
        Level {level} ・ {currentXP}/100 XP
      </Text>
    </View>
  );
}
