import React from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome'; // For an error icon

interface ErrorFallbackProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean; // If true, centers it on the screen
}

export default function ErrorFallback({
  title = "Something Went Wrong",
  message,
  onRetry,
  fullScreen = false
}: ErrorFallbackProps) {
  const containerClasses = fullScreen
    ? "flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 p-6"
    : "py-10 flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg";

  return (
    <View className={containerClasses}>
      <FontAwesome name="exclamation-triangle" size={fullScreen ? 48 : 32} color={fullScreen ? "#ef4444" : "#dc2626"} />
      <Text className={`mt-4 text-xl font-bold ${fullScreen ? 'text-gray-800 dark:text-gray-200' : 'text-red-700 dark:text-red-300'} text-center`}>
        {title}
      </Text>
      <Text className={`mt-2 text-base ${fullScreen ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'} text-center`}>
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-6 bg-blue-600 dark:bg-blue-700 px-6 py-3 rounded-lg shadow-md active:opacity-80"
        >
          <Text className="text-white font-semibold text-base">Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}
