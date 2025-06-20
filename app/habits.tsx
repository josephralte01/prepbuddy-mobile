// === app/habits.tsx ===
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useUser } from '@/lib/useUser';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HabitsScreen() {
  const { user } = useUser();
  const [habits, setHabits] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    const [habitsRes, progressRes] = await Promise.all([
      api.get('/api/habits'),
      api.get('/api/habits/progress')
    ]);

    setHabits(habitsRes.data);
    const progress = progressRes.data.reduce((map: any, p: any) => {
      map[p.habit._id] = p;
      return map;
    }, {});
    setProgressMap(progress);
    setLoading(false);
  };

  const handleComplete = async (habitId: string) => {
    await api.post(`/api/habits/${habitId}/complete`);
    fetchHabits();
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) return <ActivityIndicator className="mt-10" />;

  return (
    <ProtectedRoute>
      <ScrollView className="flex-1 bg-white px-4 py-6">
        <Text className="text-2xl font-bold mb-4">🧠 Habit Tracker</Text>
        {habits.map((habit: any) => {
          const progress = progressMap[habit._id];
          const today = new Date().toDateString();
          const lastCompleted = progress?.lastCompleted ? new Date(progress.lastCompleted).toDateString() : null;
          const completedToday = lastCompleted === today;

          return (
            <View key={habit._id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <Text className="text-lg font-semibold mb-1">{habit.title}</Text>
              <Text className="text-sm text-gray-700 mb-1">{habit.description}</Text>
              <Text className="text-sm text-gray-600">Frequency: {habit.frequency}</Text>
              <Text className="text-sm text-gray-600">Streak: {progress?.streak || 0} days</Text>
              <Text className="text-sm text-gray-600 mb-2">XP: {habit.xpReward}</Text>
              <Pressable
                className={`p-2 rounded-full ${completedToday ? 'bg-green-500' : 'bg-blue-600'}`}
                onPress={() => handleComplete(habit._id)}
                disabled={completedToday}
              >
                <Text className="text-white text-center font-semibold">
                  {completedToday ? '✅ Completed' : 'Mark as Done'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </ProtectedRoute>
  );
}
