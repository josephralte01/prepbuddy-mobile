import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, Link } from 'expo-router';
// useQuery and api are now in the hook
import ProtectedRoute from '@/components/ProtectedRoute';
// Toast is now handled by the hook
import { useChapterList, ChapterListItem } from '@/hooks/learn/useChapterList'; // Import the new hook

export default function ChapterListScreen() {
  // Assuming 'id' is subjectId passed from the previous screen (e.g., LearnIndexScreen)
  const { id: subjectId, subjectName } = useLocalSearchParams<{ id: string, subjectName?: string }>();
  const router = useRouter();

  // Use the hook to fetch chapters
  const { chapters, isLoading, isError, error } = useChapterList(subjectId);

  const screenTitle = subjectName ? `${subjectName} Chapters` : "Chapters";

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{ title: "Loading Chapters..." }} />
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
          <ActivityIndicator size="large" />
        </View>
      </ProtectedRoute>
    );
  }
  if (isError) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{ title: "Error" }} />
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
          <Text className="text-red-500 text-center">Failed to load chapters: {error?.message}</Text>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ title: screenTitle }} />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        {/* <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{screenTitle}</Text> */}

        {chapters && chapters.length > 0 ? (
          <FlatList
            data={chapters}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-4 shadow-md">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{item.title}</Text>

                <View className="flex-row gap-x-3">
                  <Link href={`/learn/material/${item._id}`} asChild>
                    <Pressable className="flex-1 bg-blue-600 dark:bg-blue-700 px-3 py-2.5 rounded-lg items-center justify-center">
                      <Text className="text-white text-sm font-medium">📘 Study Material</Text>
                    </Pressable>
                  </Link>

                  {/* Updated path for mock test based on guidance */}
                  <Link href={`/learn/mock-tests/chapter/${item._id}`} asChild>
                    <Pressable className="flex-1 bg-green-600 dark:bg-green-700 px-3 py-2.5 rounded-lg items-center justify-center">
                      <Text className="text-white text-sm font-medium">🧪 Take Test</Text>
                    </Pressable>
                  </Link>
                </View>
                {/* Optionally show completion status if available:
                {item.isCompleted && <Text className="text-xs text-green-500 mt-2">Completed</Text>}
                */}
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No chapters found for this subject.</Text>
            }
          />
        ) : (
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No chapters available for {subjectName || 'this subject'}.</Text>
        )}
      </View>
    </ProtectedRoute>
  );
}
