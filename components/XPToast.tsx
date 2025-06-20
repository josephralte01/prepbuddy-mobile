import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
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
      ]).start(() => onComplete && onComplete());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}> 
      <Text style={styles.toastText}>+{xp} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 99,
  },
  toastText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
