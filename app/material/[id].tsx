import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import XPToast from '@/components/XPToast';

type StudyMaterial = {
  bulletPoints: string[];
};

const fetchMaterial = async (chapterId: string) => {
  const res = await api.get<StudyMaterial>(`/api/material/${chapterId}`);
  return res.data;
};

export default function StudyMaterialScreen() {
  const { id } = useLocalSearchParams();
  const [showXP, setShowXP] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [completed, setCompleted] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['material', id],
    queryFn: () => fetchMaterial(id as string),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/material/${id}/complete`);
      return res.data;
    },
    onSuccess: (data) => {
      setEarnedXP(data.xp || 0);
      setShowXP(true);
      setCompleted(true);
    },
  });

  if (isLoading) return <ActivityIndicator className="mt-20" />;
  if (isError) return <Text className="text-red-500 mt-10 text-center">Failed to load study material</Text>;

  return (
    <ProtectedRoute>
      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-2xl font-bold mb-4">Study Material</Text>

        {data?.bulletPoints?.map((point, idx) => (
          <View key={idx} className="mb-3">
            <Text className="text-base text-gray-800">• {point}</Text>
          </View>
        ))}

        {!completed ? (
          <Pressable
            className="bg-green-600 mt-6 p-3 rounded-full"
            onPress={() => mutation.mutate()}
          >
            <Text className="text-white text-center font-semibold">✅ Mark as Complete</Text>
          </Pressable>
        ) : (
          <View className="mt-6">
            <Text className="text-center text-green-700 font-semibold">Chapter completed!</Text>
          </View>
        )}

        {showXP && (
          <XPToast xp={earnedXP} onFinish={() => setShowXP(false)} />
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}
