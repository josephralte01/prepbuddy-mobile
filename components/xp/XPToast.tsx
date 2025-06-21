import React from "react";
import { View, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function XPToast({ xp, visible, onComplete }: { xp: number; visible: boolean; onComplete?: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }, [visible, opacity, onComplete]); // Added opacity and onComplete to dependencies

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute bottom-24 self-center bg-gray-800 dark:bg-gray-200 py-2.5 px-5 rounded-full shadow-lg z-50"
      // Removed inline style for opacity, it's handled by Animated.View directly on the native side
      // For web or if native driver is false, you might need style: { opacity }
      // This component is likely for native only given react-native-confetti-cannon was used elsewhere.
      style={{ opacity }} // Keep style for opacity if Animated.View doesn't handle it automatically via className or similar prop
    >
      <Text className="text-white dark:text-gray-900 font-bold text-base">+{xp} XP</Text>
    </Animated.View>
  );
}
