import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useUser } from '@/hooks/user/useUser';
import { api } from '@/lib/api';
import { useRouter, Stack } from 'expo-router';

interface Reward {
  _id: string;
  title: string;
  description: string;
  xp: number;
}

// Renamed function for new file name/context
export default function ClaimXPScreen() {
  const { user, refetch: refetchUser } = useUser();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const res = await api.get('/xp/rewards');
        setRewards(res.data || []);
      } catch (err) {
        console.error("Failed to fetch rewards:", err);
        Alert.alert('Error', 'Could not load available XP rewards.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
        fetchRewards();
    } else {
        setLoading(false);
    }
  }, [user]);

  const handleClaim = async (rewardId: string) => {
    setClaimingId(rewardId);
    try {
      const res = await api.post(`/xp/claim/${rewardId}`);
      Alert.alert('🎉 XP Claimed!', res.data.message || `You earned ${res.data.xpEarned || ''} XP!`);
      refetchUser();
      setRewards(prevRewards => prevRewards.filter(r => r._id !== rewardId));
    } catch (err: any) {
      Alert.alert('Error Claiming XP', err.response?.data?.message || 'Could not claim XP reward.');
    } finally {
      setClaimingId(null);
    }
  };

  if (loading && !user) {
    return (
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <ActivityIndicator size="large" />
        </View>
    )
  }

  if (!user) {
    return (
        <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
            <Stack.Screen options={{ title: "Claim XP" }} />
            <Text className="text-lg text-center text-gray-700 dark:text-gray-300 mb-4">Please login to see your claimable XP rewards.</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')} className="px-6 py-3 bg-blue-600 rounded-lg">
                <Text className="text-white font-semibold">Go to Login</Text>
            </TouchableOpacity>
        </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: "Claim XP Rewards" }} />
      <ScrollView contentContainerClassName="p-4 pb-10 bg-gray-50 dark:bg-gray-900 grow">
        <Text className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">🎖️ Claim XP Rewards</Text>
        {loading ? (
           <ActivityIndicator size="large" className="mt-10"/>
        ) : rewards.length === 0 ? (
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No unclaimed XP rewards available right now. Keep learning!</Text>
        ) : (
          rewards.map((reward) => (
            <View key={reward._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl mb-4 shadow-md">
              <Text className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{reward.title}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300 mb-4">{reward.description}</Text>
              <TouchableOpacity
                className={`py-3 px-4 rounded-lg items-center justify-center h-12 ${claimingId === reward._id ? 'bg-gray-400 dark:bg-gray-600' : 'bg-yellow-500 dark:bg-yellow-600'}`}
                onPress={() => handleClaim(reward._id)}
                disabled={claimingId === reward._id}
              >
                {claimingId === reward._id ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white font-bold text-base">Claim {reward.xp} XP</Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}
