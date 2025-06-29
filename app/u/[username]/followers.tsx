import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function FollowersScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/social/followers/${username}`);
        setFollowers(res.data);
      } catch {
        setFollowers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold mb-4 text-center">Followers</Text>
      {loading ? (
        <ActivityIndicator />
      ) : followers.length === 0 ? (
        <Text className="text-center text-gray-500">No followers yet</Text>
      ) : (
        followers.map((f: any) => (
          <Pressable
            key={f._id}
            onPress={() => router.push(`/u/${f.username}`)}
            className="mb-4 bg-gray-100 rounded-xl px-4 py-3"
          >
            <Text className="font-semibold">{f.name}</Text>
            <Text className="text-sm text-gray-500">@{f.username}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
