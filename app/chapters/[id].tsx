import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type Chapter = {
  _id: string;
  title: string;
  isCompleted?: boolean;
};

const fetchChapters = async (subjectId: string) => {
  const res = await api.get<Chapter[]>(`/api/chapters/${subjectId}`);
  return res.data;
};

export default function ChapterListScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['chapters', id],
    queryFn: () => fetchChapters(id as string),
    enabled: !!id,
  });

  if (isLoading) return <ActivityIndicator className="mt-20" />;
  if (isError) return <Text className="text-red-500 mt-10 text-center">Failed to load chapters</Text>;

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Chapters</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 rounded-xl mb-3 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2">{item.title}</Text>
            
            <View className="flex-row gap-3">
              <Pressable
                className="bg-blue-600 px-3 py-2 rounded-full"
                onPress={() => router.push(`/material/${item._id}`)}
              >
                <Text className="text-white text-sm">📘 Study</Text>
              </Pressable>

              <Pressable
                className="bg-green-600 px-3 py-2 rounded-full"
                onPress={() => router.push(`/mock-test/${item._id}`)}
              >
                <Text className="text-white text-sm">🧪 Take Test</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
