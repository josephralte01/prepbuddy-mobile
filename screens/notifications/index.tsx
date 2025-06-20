import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import api from "../../lib/api";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const fetchNotifications = async () => {
    const res = await api.get("/notifications/me");
    setNotifications(res.data);
  };

  const markAsRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-3 mb-2 rounded-lg bg-white shadow"
            onPress={() => markAsRead(item._id)}
          >
            <Text className="font-semibold text-sm">{item.title}</Text>
            <Text className="text-gray-600 text-xs">{item.message}</Text>
            {!item.isRead && <Text className="text-blue-500 text-xs mt-1">Tap to mark as read</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
