import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import api from "@/lib/api"; // Adjusted path
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  // Add other relevant fields like 'createdAt', 'type', 'link' if available
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Not currently used, but kept for consistency

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications/me");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // TODO: Add user-facing error feedback
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // TODO: Add user-facing error feedback
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">🔔 Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-3 mb-3 rounded-lg shadow-md ${item.isRead ? 'bg-gray-200 dark:bg-gray-700 opacity-70' : 'bg-white dark:bg-gray-800'}`}
            onPress={() => !item.isRead && markAsRead(item._id)}
          >
            <Text className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</Text>
            <Text className="text-gray-600 dark:text-gray-300 text-xs mt-1">{item.message}</Text>
            {!item.isRead && (
              <View className="absolute top-2 right-2 bg-blue-500 rounded-full w-3 h-3" />
              // Or <Text className="text-blue-500 dark:text-blue-400 text-xs mt-1 font-semibold">New</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No notifications yet.</Text>}
        refreshing={loading} // For pull-to-refresh if FlatList is wrapped with RefreshControl
        onRefresh={fetchNotifications} // For pull-to-refresh
      />
    </View>
  );
}
