import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <LinearGradient colors={["#4f46e5", "#3b82f6"]} style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: string = "home";
        if (route.name === "Habits") iconName = "flame";
        else if (route.name === "Badges") iconName = "ribbon";
        else if (route.name === "DoubtSolver") iconName = "chatbubble-ellipses";
        else if (route.name === "Leaderboard") iconName = "trophy";

        const showBadge = route.name === "Habits" && options.tabBarBadge;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            accessibilityRole="button"
          >
            <Ionicons
              name={iconName as any}
              size={isFocused ? 28 : 24}
              color={isFocused ? "white" : "#d1d5db"}
            />
            {showBadge && <View style={styles.badgeDot} />}
            <Text style={[styles.label, { color: isFocused ? "white" : "#d1d5db" }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  badgeDot: {
    position: "absolute",
    top: 4,
    right: 18,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
});
