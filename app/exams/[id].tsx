import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type Subject = {
  _id: string;
  name: string;
  description?: string;
};

const fetchSubjects = async (examId: string) => {
  const res = await api.get<Subject[]>(`/api/subjects/${examId}`);
  return res.data;
};

export default function SubjectListScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subjects', id],
    queryFn: () => fetchSubjects(id as string),
    enabled: !!id,
  });

  if (isLoading) return <ActivityIndicator className="mt-20" />;
  if (isError) return <Text className="text-red-500 mt-10 text-center">Failed to load subjects</Text>;

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Subjects for Exam</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/chapters/${item._id}`)}
            className="bg-indigo-600 p-4 rounded-2xl mb-3 shadow"
          >
            <Text className="text-white text-lg font-semibold">{item.name}</Text>
            {item.description && (
              <Text className="text-indigo-100 text-sm">{item.description}</Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}
