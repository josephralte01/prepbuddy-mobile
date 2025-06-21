import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Link, Stack } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon'; // Added for celebration

// Expected params from the mock test submission
interface MockTestResultParams {
    score: string;
    xp: string;
    streak?: string; // Optional
    totalQuestions: string;
    chapterId?: string; // To navigate back to the chapter or related content
}

export default function MockTestResultScreen() {
  const params = useLocalSearchParams<MockTestResultParams>();
  const router = useRouter();

  const score = parseInt(params.score || "0");
  const totalQuestions = parseInt(params.totalQuestions || "0");
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <>
    <Stack.Screen options={{ title: "Test Result" }} />
    <ScrollView contentContainerClassName="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center p-6 grow">
      <View className="items-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <Text className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-3">🎉 Test Completed!</Text>

        <View className="my-6 space-y-3 w-full">
            <View className="flex-row justify-between items-baseline">
                <Text className="text-xl text-gray-700 dark:text-gray-300">Your Score:</Text>
                <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}/{totalQuestions} ({percentage}%)</Text>
            </View>
            <View className="flex-row justify-between items-baseline">
                <Text className="text-xl text-gray-700 dark:text-gray-300">XP Earned:</Text>
                <Text className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">+{params.xp || 0}</Text>
            </View>
            {params.streak && (
                 <View className="flex-row justify-between items-baseline">
                    <Text className="text-xl text-gray-700 dark:text-gray-300">Current Streak:</Text>
                    <Text className="text-3xl font-bold text-orange-500 dark:text-orange-400">{params.streak}🔥</Text>
                </View>
            )}
        </View>

        <View className="mt-8 w-full space-y-3">
            {params.chapterId && (
                 <Link href={`/learn/chapters/${params.chapterId}`} asChild>
                    <Pressable className="bg-blue-600 dark:bg-blue-700 px-6 py-3.5 rounded-lg w-full items-center shadow-md">
                        <Text className="text-white text-lg font-semibold">Back to Chapter</Text>
                    </Pressable>
                 </Link>
            )}
            <Link href="/learn" asChild>
                <Pressable className="bg-gray-200 dark:bg-gray-700 px-6 py-3.5 rounded-lg w-full items-center">
                    <Text className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Explore More</Text>
                </Pressable>
            </Link>
        </View>
      </View>
      {/* Fire confetti only if score is decent, e.g. > 50% */}
      {percentage >= 50 && <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} autoStart fadeOut />}
    </ScrollView>
    </>
  );
}
