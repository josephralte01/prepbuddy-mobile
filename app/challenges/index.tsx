// === prepbuddy-mobile/app/challenges/index.tsx ===
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useUser } from '@/lib/useUser';
import { useChallengeSocket } from '@/hooks/useChallengeSocket';
import ChallengeCard from '@/components/ChallengeCard';

export default function ChallengesScreen() {
  const { user } = useUser();
  useChallengeSocket(); // 👈 enable real-time updates

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const res = await api.get('/api/challenges');
      return res.data;
    },
    enabled: !!user,
  });

  if (isLoading) return <ActivityIndicator className="mt-20" />;
  if (isError)
    return <Text className="text-red-500 mt-10 text-center">Failed to load challenges</Text>;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold mb-4 text-center">🏆 Challenges</Text>
      {data?.length ? (
        data.map((challenge: any) => (
          <ChallengeCard key={challenge._id} challenge={challenge} onRefresh={refetch} />
        ))
      ) : (
        <Text className="text-center text-gray-500">No challenges yet</Text>
      )}
    </ScrollView>
  );
}
