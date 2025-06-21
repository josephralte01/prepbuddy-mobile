import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Link, Stack } from 'expo-router'; // Added Link, Stack
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface FollowUser {
  _id: string;
  username: string;
  name: string;
  // Add avatar or other relevant fields if available
}

export default function FollowersScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/social/followers/${username}`); // Ensure API endpoint is correct
        setFollowers(res.data);
      } catch (err: any) {
        console.error("Failed to fetch followers:", err.response?.data || err.message);
        setFollowers([]);
        // TODO: Toast error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  return (
    <>
      <Stack.Screen options={{ title: `${username}'s Followers`, headerBackTitle: "Profile" }} />
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-6">
        {/* <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Followers</Text> */}
        {loading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" />
          </View>
        ) : followers.length === 0 ? (
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">
            {username} has no followers yet.
          </Text>
        ) : (
          followers.map((follower) => (
            <Link key={follower._id} href={`/profile/${follower.username}`} asChild>
              <Pressable className="mb-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm active:opacity-70">
                <Text className="font-semibold text-lg text-gray-900 dark:text-white">{follower.name}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">@{follower.username}</Text>
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </>
  );
}
