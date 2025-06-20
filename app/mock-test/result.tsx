import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function MockTestResultScreen() {
  const { score, xp, streak } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-3xl font-bold text-green-600 mb-4">🎉 Test Completed!</Text>

      <Text className="text-xl mb-2">📝 Score: <Text className="font-semibold">{score}</Text></Text>
      <Text className="text-xl mb-2">⚡ XP Earned: <Text className="font-semibold">{xp}</Text></Text>
      <Text className="text-xl mb-6">🔥 Streak: <Text className="font-semibold">{streak} days</Text></Text>

      <Pressable
        onPress={() => router.replace('/')}
        className="bg-blue-600 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">🏠 Go to Dashboard</Text>
      </Pressable>
    </View>
  );
}
