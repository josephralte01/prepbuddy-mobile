// === app/challenges.tsx ===
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import ChallengeCompletedModal from '@/components/ChallengeCompletedModal';

export default function ChallengeScreen() {
  const [completed, setCompleted] = useState(false);

  const { data: challenges, refetch } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const res = await api.get('/api/challenges');
      return res.data;
    }
  });

  const claimReward = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/api/challenges/${id}/claim`);
    },
    onSuccess: () => {
      setCompleted(true);
      refetch();
    }
  });

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">🏆 Your Challenges</Text>

      {challenges?.map((challenge: any) => (
        <View key={challenge._id} className="bg-gray-100 p-4 rounded-xl mb-4">
          <Text className="font-semibold text-lg mb-1">{challenge.title}</Text>
          <Text className="text-gray-700 text-sm mb-2">{challenge.description}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-blue-600 font-medium">
              {challenge.progress}/{challenge.target} Complete
            </Text>

            {challenge.completed && !challenge.claimed ? (
              <Pressable
                onPress={() => claimReward.mutate(challenge._id)}
                className="bg-green-600 px-3 py-1.5 rounded-full"
              >
                <Text className="text-white text-sm">Claim XP</Text>
              </Pressable>
            ) : challenge.claimed ? (
              <Text className="text-green-700 font-medium">✅ Claimed</Text>
            ) : null}
          </View>
        </View>
      ))}

      <ChallengeCompletedModal visible={completed} onClose={() => setCompleted(false)} />
    </ScrollView>
  );
}
v