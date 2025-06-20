import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api'; // ✅ central axios instance

type Exam = {
  _id: string;
  name: string;
  description: string;
};

const fetchExams = async () => {
  const response = await api.get<Exam[]>('/api/exams'); // ✅ uses live backend base URL
  return response.data;
};

export default function ExamListScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['exams'],
    queryFn: fetchExams,
  });

  if (isLoading) return <ActivityIndicator className="mt-20" />;
  if (isError) return <Text className="text-red-500 mt-10 text-center">Failed to load exams</Text>;

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Choose an Exam</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/exams/${item._id}`)}
            className="bg-blue-600 p-4 rounded-2xl mb-3 shadow"
          >
            <Text className="text-white text-lg font-semibold">{item.name}</Text>
            <Text className="text-blue-100 text-sm">{item.description}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
