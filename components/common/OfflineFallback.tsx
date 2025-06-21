import React from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// Import the mock hook. TODO: Change this path when actual library is used.
import { useNetInfo } from '@/lib/mockUseNetInfo';

interface OfflineFallbackProps {
  onRetry?: () => void; // Optional retry action
  message?: string;
  title?: string;
}

export default function OfflineFallback({
  onRetry,
  message = "You are currently offline. Please check your internet connection.",
  title = "No Internet Connection"
}: OfflineFallbackProps) {
  const netInfo = useNetInfo();

  // Only render the fallback if definitely offline and internet is not reachable
  // isConnected might be true for WiFi connection even if there's no internet.
  // isInternetReachable is a more reliable indicator.
  if (netInfo.isInternetReachable === true || netInfo.isInternetReachable === null) {
    // If null, we don't know for sure, so don't show offline message.
    // If true, definitely online.
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-800 p-6">
      <FontAwesome name="wifi" size={48} color="#f59e0b" />
      <Text className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
        {title}
      </Text>
      <Text className="mt-2 text-base text-gray-600 dark:text-gray-400 text-center">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-8 bg-amber-500 dark:bg-amber-600 px-6 py-3 rounded-lg shadow-md active:opacity-80"
        >
          <Text className="text-white font-semibold text-base">Retry</Text>
        </Pressable>
      )}
      <Text className="mt-6 text-xs text-gray-400 dark:text-gray-500">
        (Note: Using a mocked network status for now)
      </Text>
    </View>
  );
}

// A global component to wrap the app or specific parts to show OfflineFallback
export function NetworkStatusWrapper({ children }: { children: React.ReactNode }) {
  const netInfo = useNetInfo();

  if (netInfo.isInternetReachable === false) {
    // You might want a more sophisticated retry mechanism here, e.g., tied to a global refetch action
    return <OfflineFallback />;
  }

  return <>{children}</>;
}
