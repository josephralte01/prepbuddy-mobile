import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingFallbackProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean; // If true, centers it on the screen
}

export default function LoadingFallback({
  message = "Loading...",
  size = "large",
  fullScreen = false
}: LoadingFallbackProps) {
  const containerClasses = fullScreen
    ? "flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 p-4"
    : "py-10 flex items-center justify-center"; // For inline usage

  return (
    <View className={containerClasses}>
      <ActivityIndicator size={size} color={fullScreen ? "#3b82f6" : "#6b7280"} />
      {message && <Text className="mt-3 text-base text-gray-600 dark:text-gray-400">{message}</Text>}
    </View>
  );
}
