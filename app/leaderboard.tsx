import { View, Text, FlatList, Pressable, ActivityIndicator, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'expo-router';

export default function LeaderboardScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/leaderboard');
        setUsers(res.data);
        if (user) {
          const fRes = await api.get('/api/social/following');
          const followingList = fRes.data.map((u: any) => u.username);
          setFollowing(followingList);

          const suggestionsList = res.data.filter(
            (u: any) => u.username !== user.username && !followingList.includes(u.username)
          ).slice(0, 5);
          setSuggestions(suggestionsList);
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const toggleFollow = async (username: string) => {
    const route = following.includes(username) ? 'unfollow' : 'follow';
    try {
      await api.post(`/api/social/${route}/${username}`);
      setFollowing((prev) =>
        route === 'follow' ? [...prev, username] : prev.filter((u) => u !== username)
      );
    } catch (err) {
      console.error('Error updating follow');
    }
  };

  const calculateLevelProgress = (xp: number) => (xp % 100) / 100;

  if (loading) return <ActivityIndicator className="mt-20" />;

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-3xl font-bold text-center mb-4">🏆 Leaderboard</Text>

      {suggestions.length > 0 && (
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">🔍 People You May Want to Follow</Text>
          {suggestions.map((item) => (
            <View
              key={item._id}
              className="flex-row justify-between items-center bg-yellow-50 rounded-xl p-3 mb-2"
            >
              <Pressable onPress={() => router.push(`/u/${item.username}`)}>
                <Text className="font-medium text-base text-blue-600">{item.name}</Text>
                <Text className="text-sm text-gray-500">@{item.username} • {item.xp} XP</Text>
              </Pressable>
              <Pressable
                onPress={() => toggleFollow(item.username)}
                className="rounded-full px-4 py-1.5 bg-blue-600"
              >
                <Text className="text-white text-sm font-medium">Follow</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const progress = calculateLevelProgress(item.xp);
          return (
            <Animated.View
              style={{ opacity: fadeAnim }}
              className="flex-row justify-between items-center bg-gray-100 rounded-xl p-4 mb-3"
            >
              <Pressable onPress={() => router.push(`/u/${item.username}`)}>
                <Text className="font-medium text-base text-blue-600">{item.name}</Text>
                <Text className="text-sm text-gray-500">@{item.username} • {item.xp} XP • #{item.rank}</Text>
                <View className="h-2 bg-gray-300 rounded-full mt-1 w-40">
                  <View
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </View>
              </Pressable>

              {user?.username !== item.username && (
                <Pressable
                  onPress={() => toggleFollow(item.username)}
                  className={`rounded-full px-4 py-2 ${
                    following.includes(item.username) ? 'bg-gray-300' : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-white font-medium text-sm">
                    {following.includes(item.username) ? 'Unfollow' : 'Follow'}
                  </Text>
                </Pressable>
              )}
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
