// lib/mockUseNetInfo.ts
// Mock implementation for @react-native-community/netinfo
// TODO: Replace with actual library import and usage once install issue is resolved.

import { useState, useEffect } from 'react';

interface MockNetInfoState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null; // Simplified type
}

export const useNetInfo = (): MockNetInfoState => {
  const [netInfo, setNetInfo] = useState<MockNetInfoState>({
    isConnected: true, // Assume connected by default for mock
    isInternetReachable: true, // Assume reachable by default for mock
    type: 'wifi', // Default type
  });

  // Simulate network changes for testing (optional)
  // useEffect(() => {
  //   const MOCK_TOGGLE_INTERVAL = 15000; // Toggle every 15 seconds
  //   console.warn(
  //     "Using MOCKED useNetInfo. Network status will be simulated to toggle every 15s. Replace with actual library."
  //   );
  //   const intervalId = setInterval(() => {
  //     setNetInfo((prev) => ({
  //       ...prev,
  //       isConnected: !prev.isConnected,
  //       isInternetReachable: !prev.isInternetReachable,
  //       type: prev.isConnected ? 'none' : 'wifi',
  //     }));
  //   }, MOCK_TOGGLE_INTERVAL);
  //   return () => clearInterval(intervalId);
  // }, []);

  // For a simpler mock, just return a default state:
  // return { isConnected: true, isInternetReachable: true, type: 'wifi' };

  // For more interactive mock during development:
  useEffect(() => {
    console.warn(
      "Using MOCKED useNetInfo. Network status is currently hardcoded to 'connected'. Replace with actual library for real network detection."
    );
    // To simulate offline:
    // setNetInfo({ isConnected: false, isInternetReachable: false, type: 'none' });
  }, []);


  return netInfo;
};
