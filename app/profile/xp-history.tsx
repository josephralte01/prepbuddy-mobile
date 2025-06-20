import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

type XPLog = {
  _id: string;
  action: string;
  xpEarned: number;
  createdAt: string;
};

export default function XPHistoryScreen() {
  const [logs, setLogs] = useState<XPLog[]>([]);

  useEffect(() => {
    api.get('/api/xp-logs/my').then((res) => {
      setLogs(res.data.logs);
    });
  }, []);

  const totalXP = logs.reduce((sum, log) => sum + (log.xpEarned || 0), 0);

  return (
    <ProtectedRoute>
      <ScrollView className="p-4 bg-white">
        <Text className="text-2xl font-bold mb-4 text-center">📜 XP History</Text>

        <View className="mb-4 items-center">
          <Text className="text-lg font-semibold">💪 Total XP Earned</Text>
          <Text className="text-xl text-blue-600 font-bold">{totalXP}</Text>
        </View>

        {logs.length === 0 ? (
          <Text className="text-center text-gray-500">No XP logs yet</Text>
        ) : (
          logs.map((log) => (
            <View key={log._id} className="mb-3 border-b pb-2">
              <Text className="text-base capitalize">{log.action.replace(/_/g, ' ')}</Text>
              <Text className="text-sm text-gray-600">+{log.xpEarned} XP</Text>
              <Text className="text-xs text-gray-400">
                {new Date(log.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}
