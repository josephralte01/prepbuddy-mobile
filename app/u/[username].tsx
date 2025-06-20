import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useUser } from '@/lib/useUser';

export default function PublicProfileScreen() {
  const { username } = useLocalSearchParams();
  const { user } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/users/public/${username}`);
        setProfile(res.data);
        if (user && res.data.followers.includes(user._id)) {
          setIsFollowing(true);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  const toggleFollow = async () => {
    if (!profile) return;
    const route = isFollowing ? 'unfollow' : 'follow';
    try {
      await api.post(`/api/social/${route}/${profile.username}`);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Failed to toggle follow status');
    }
  };

  if (loading) return <ActivityIndicator className="mt-20" />;
  if (!profile) return <Text className="text-center mt-20 text-red-500">User not found</Text>;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-3xl font-bold text-center mb-2">{profile.name}</Text>
      <Text className="text-center text-gray-600 mb-2">@{profile.username}</Text>

      <View className="flex-row justify-center gap-8 mb-4">
        <Pressable onPress={() => router.push(`/u/${username}/followers`)}>
          <Text className="text-center text-sm font-medium text-blue-600">
            {profile.followers.length} Followers
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push(`/u/${username}/following`)}>
          <Text className="text-center text-sm font-medium text-blue-600">
            {profile.following.length} Following
          </Text>
        </Pressable>
      </View>

      <View className="items-center mb-6">
        <Text className="text-base text-gray-700">XP: {profile.xp}</Text>
        <Text className="text-base text-gray-700">🔥 Streak: {profile.streak} days</Text>
        {profile.rank && (
          <Text className="text-sm text-blue-600 font-medium mt-1">#{profile.rank} on leaderboard</Text>
        )}
      </View>

      {user?.username !== profile.username && (
        <Pressable
          className={`rounded-full px-6 py-3 ${isFollowing ? 'bg-gray-300' : 'bg-blue-500'}`}
          onPress={toggleFollow}
        >
          <Text className="text-white text-center font-semibold">
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
