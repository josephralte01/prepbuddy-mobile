import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
// useQuery is now in the hook
import { useRouter, Stack } from 'expo-router';
// api is now used in the hook
import ProtectedRoute from '@/components/ProtectedRoute';
// Toast is now handled by the hook
import { useExamList } from '@/hooks/learn/useExamList'; // Import the new hook

export default function ExamListScreen() {
  const router = useRouter();
  // Use the hook to fetch exams and manage state
  const { exams, isLoading, isError, error } = useExamList();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{ title: "Loading Exams..."}} />
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
          <ActivityIndicator size="large" />
        </View>
      </ProtectedRoute>
    );
  }

  if (isError) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{ title: "Error"}} />
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
          <Text className="text-red-500 text-center">Failed to load exams: {error?.message}</Text>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ title: "Available Exams"}} />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        {/* <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Choose an Exam</Text> */}

        {exams && exams.length > 0 ? (
            <FlatList
                data={exams}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                <Pressable
                    onPress={() => router.push(`/learn/exams/${item._id}`)} // Updated path
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl mb-4 shadow-md active:opacity-80"
                >
                    <Text className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</Text>
                </Pressable>
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No exams available at the moment.</Text>
                }
            />
        ) : (
            <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No exams found.</Text>
        )}
      </View>
    </ProtectedRoute>
  );
}
