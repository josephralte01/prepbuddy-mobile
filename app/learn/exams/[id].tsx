import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; // Added Stack
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Toast from 'react-native-toast-message';

interface Subject {
  _id: string;
  name: string;
  description?: string;
  // examName?: string; // Could be passed or fetched if needed for title
}

// Assuming this endpoint fetches subjects for a specific exam
const fetchSubjectsForExam = async (examId: string): Promise<Subject[]> => {
  const res = await api.get<Subject[]>(`/exams/${examId}/subjects`); // Example: more RESTful endpoint
  return res.data;
};

export default function ExamSubjectListScreen() {
  // 'id' here is examId
  const { id: examId, examName } = useLocalSearchParams<{ id: string, examName?: string }>();
  const router = useRouter();

  const { data: subjects, isLoading, isError, error } = useQuery<Subject[], Error>(
    ['examSubjects', examId], // Query key specific to subjects of an exam
    () => fetchSubjectsForExam(examId as string),
    {
      enabled: !!examId,
      onError: (err: any) => {
        Toast.show({type: 'error', text1: 'Error', text2: err.message || 'Could not load subjects.'})
      }
    }
  );

  const screenTitle = examName ? `${examName} Subjects` : "Subjects";

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{ title: "Loading Subjects..."}} />
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
          <Text className="text-red-500 text-center">Failed to load subjects: {error?.message}</Text>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ title: screenTitle }} />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        {/* <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{screenTitle}</Text> */}

        {subjects && subjects.length > 0 ? (
            <FlatList
                data={subjects}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                <Pressable
                    // Pass subjectName to chapter list screen for better title
                    onPress={() => router.push({ pathname: `/learn/chapters/${item._id}`, params: { subjectName: item.name } })}
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl mb-4 shadow-md active:opacity-80"
                >
                    <Text className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</Text>
                    {item.description && (
                    <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</Text>
                    )}
                </Pressable>
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No subjects found for this exam.</Text>
                }
            />
        ) : (
            <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No subjects available for {examName || 'this exam'}.</Text>
        )}
      </View>
    </ProtectedRoute>
  );
}
