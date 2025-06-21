import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, Redirect } from 'expo-router'; // Removed Link and Pressable as they are not used for basic tabs
// Href is an object for Tabs.Screen, not a component here.

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
// useClientOnlyValue might not be needed if headerShown is consistent across platforms or handled differently.
// For simplicity, let's assume headerShown: false for these tabs, or it's handled by the screen itself.

// TabBarIcon helper component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />; // Adjusted size
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeTintColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveTintColor = Colors[colorScheme ?? 'light'].tabIconDefault; // Using a common inactive color

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        headerShown: false, // Common to disable headers for tab screens, let screens manage their own.
        tabBarStyle: {
            // backgroundColor: Colors[colorScheme ?? 'light'].background, // Optional: if tab bar needs specific bg
            // borderTopColor: Colors[colorScheme ?? 'light'].tabIconDefault, // Optional
        }
      }}>
      {/* Tab 1: Learn - Default initial route for (tabs) */}
      {/* To make "learn" the default, we can either have an index.tsx that redirects,
          or rely on the order and Expo Router's default behavior.
          For explicit default, an index.tsx file in (tabs) that redirects to /learn is best.
          Let's create that redirect file after this.
      */}
      <Tabs.Screen name="index" options={{ href: null, title: "Redirect" }} />

      <Tabs.Screen
        name="learn" // This will expect app/(tabs)/learn.tsx or similar
        options={{
          title: 'Learn',
          href: '/learn', // Points to app/learn/index.tsx
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          href: '/habits', // Points to app/habits/index.tsx
          tabBarIcon: ({ color }) => <TabBarIcon name="check-square-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Challenges',
          href: '/challenges', // Points to app/challenges/index.tsx
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Rankings', // Changed title for brevity
          href: '/leaderboard', // Points to app/leaderboard/index.tsx
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: '/profile', // Points to app/profile/index.tsx
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
