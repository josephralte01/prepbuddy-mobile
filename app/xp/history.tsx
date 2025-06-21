import { View, Text, ScrollView, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Stack } from 'expo-router'; // For screen title
import Toast from 'react-native-toast-message';

type XPLog = {
  _id: string;
  action: string;
  xpEarned: number;
  createdAt: string;
};

export default function XPHistoryScreen() {
  const [logs, setLogs] = useState<XPLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0); // Calculate total XP from logs

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/xp-logs/my'); // Removed /api prefix
        setLogs(res.data.logs || []);
        // Calculate total XP from the fetched logs
        const calculatedTotalXP = (res.data.logs || []).reduce((sum: number, log: XPLog) => sum + (log.xpEarned || 0), 0);
        setTotalXP(calculatedTotalXP);
      } catch (error) {
        console.error("Failed to fetch XP logs:", error);
        Toast.show({type: 'error', text1: 'Error', text2: 'Could not load XP history.'})
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{ title: "XP History" }} />
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
          <ActivityIndicator size="large" />
        </View>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ title: "XP History" }} />
      <ScrollView className="p-4 bg-gray-50 dark:bg-gray-900">
        <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">📜 XP History</Text>

        <View className="mb-6 items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">💪 Total XP Earned</Text>
          <Text className="text-3xl text-blue-600 dark:text-blue-400 font-bold mt-1">{totalXP}</Text>
        </View>

        {logs.length === 0 ? (
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No XP logs yet. Keep learning and completing tasks!</Text>
        ) : (
          logs.map((log) => (
            <View key={log._id} className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3 bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
              <Text className="text-base capitalize font-medium text-gray-800 dark:text-gray-200">{log.action.replace(/_/g, ' ')}</Text>
              <Text className="text-sm text-green-500 dark:text-green-400 mt-0.5">+{log.xpEarned} XP</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(log.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}
