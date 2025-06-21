import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router'; // Added Stack
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Added useQueryClient
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import XPToast from '@/components/xp/XPToast';
import Toast from 'react-native-toast-message'; // For general error/success messages

interface StudyMaterial {
  title: string; // Assuming title comes from API or can be derived
  bulletPoints: string[];
  // Add other fields like 'isCompleted' if available from backend
}

const fetchMaterial = async (materialId: string): Promise<StudyMaterial> => {
  const res = await api.get<StudyMaterial>(`/material/${materialId}`); // Removed /api prefix
  return res.data;
};

export default function StudyMaterialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [showXPToast, setShowXPToast] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  // 'completed' status should ideally come from data or be part of a more robust state management
  const [isCompletedLocally, setIsCompletedLocally] = useState(false);

  const { data: material, isLoading, isError, error } = useQuery<StudyMaterial, Error>(
    ['material', id],
    () => fetchMaterial(id as string),
    {
      enabled: !!id,
      onSuccess: (data) => {
        // If backend provides completion status, set it here
        // Example: setIsCompletedLocally(data.isCompleted);
      }
    }
  );

  const completeMutation = useMutation( // Renamed for clarity
    async () => {
      const res = await api.post(`/material/${id}/complete`); // Removed /api prefix
      return res.data;
    },
    {
      onSuccess: (data) => {
        setEarnedXP(data.xpEarned || data.xp || 0); // Adjust based on actual API response
        setShowXPToast(true);
        setIsCompletedLocally(true);
        Toast.show({type: 'success', text1: 'Chapter Completed!', text2: `+${data.xpEarned || data.xp || 0} XP`});
        queryClient.invalidateQueries(['material', id]); // Invalidate to refetch and get server status
        queryClient.invalidateQueries(['user']); // Invalidate user to update XP
      },
      onError: (err: any) => {
        Toast.show({type: 'error', text1: 'Error', text2: err.response?.data?.message || 'Could not mark as complete.'});
      }
    }
  );

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{ title: "Loading Material..."}} />
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
          <Text className="text-red-500 text-center">Failed to load study material: {error?.message}</Text>
        </View>
      </ProtectedRoute>
    );
  }

  // Determine if chapter is completed (local state or from fetched data if available)
  // const actualIsCompleted = material?.isCompleted || isCompletedLocally;
  const actualIsCompleted = isCompletedLocally; // Simplified for now

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ title: material?.title || "Study Material" }} />
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        <Text className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{material?.title || 'Material'}</Text>
        {/* Could add a subtitle or description here if available */}
        <View className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"></View>


        {material?.bulletPoints?.map((point, idx) => (
          <View key={idx} className="flex-row items-start mb-3">
            <Text className="text-blue-500 dark:text-blue-400 text-xl mr-2">•</Text>
            <Text className="text-base text-gray-800 dark:text-gray-200 flex-1">{point}</Text>
          </View>
        ))}

        {!actualIsCompleted ? (
          <Pressable
            className={`mt-8 py-3 px-4 rounded-lg items-center justify-center ${completeMutation.isLoading ? 'bg-gray-400' : 'bg-green-600 dark:bg-green-700'}`}
            onPress={() => completeMutation.mutate()}
            disabled={completeMutation.isLoading}
          >
            {completeMutation.isLoading ? <ActivityIndicator color="#fff"/> :
            <Text className="text-white text-center font-semibold text-lg">✅ Mark as Complete</Text>
            }
          </Pressable>
        ) : (
          <View className="mt-8 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
            <Text className="text-center text-green-700 dark:text-green-200 font-semibold text-lg">Chapter completed!</Text>
          </View>
        )}

        {showXPToast && (
          <XPToast xp={earnedXP} visible={showXPToast} onComplete={() => setShowXPToast(false)} />
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}
