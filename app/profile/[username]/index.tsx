import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router'; // Added Link for consistency
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/user/useUser'; // Updated path

export default function PublicProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user } = useUser(); // Logged-in user
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null); // Consider defining a Profile type
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/public/${username}`); // Ensure API endpoint is correct
        setProfile(res.data);
        // Check if the logged-in user is already following this profile
        if (user && res.data.followers && res.data.followers.includes(user._id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } catch (err: any) {
        console.error('Failed to fetch profile:', err.response?.data || err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  const toggleFollow = async () => {
    if (!profile || !user) {
      // Maybe prompt login if user is null
      return;
    }
    setFollowLoading(true);
    const route = isFollowing ? 'unfollow' : 'follow';
    try {
      await api.post(`/social/${route}/${profile.username}`);
      setIsFollowing(!isFollowing);
      // Optionally refetch profile to update follower count, or update locally
      setProfile((prev: any) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((id: string) => id !== user._id)
          : [...prev.followers, user._id],
      }));
    } catch (err: any) {
      console.error('Failed to toggle follow status:', err.response?.data || err.message);
      // TODO: Show toast error
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
        <Text className="text-center text-xl text-red-500 dark:text-red-400">User not found.</Text>
        <Link href="/(tabs)/explore" asChild>
            <Pressable className="mt-4 px-4 py-2 bg-blue-600 rounded-lg">
                <Text className="text-white">Go to Explore</Text>
            </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <Text className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">{profile.name}</Text>
      <Text className="text-center text-gray-600 dark:text-gray-400 mb-4">@{profile.username}</Text>

      <View className="flex-row justify-center gap-x-6 mb-6">
        <Link href={`/profile/${username}/followers`} asChild>
          <Pressable>
            <Text className="text-center text-base font-medium text-blue-600 dark:text-blue-400">
              {profile.followers?.length || 0} Followers
            </Text>
          </Pressable>
        </Link>
        <Link href={`/profile/${username}/following`} asChild>
          <Pressable>
            <Text className="text-center text-base font-medium text-blue-600 dark:text-blue-400">
              {profile.following?.length || 0} Following
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <Text className="text-lg text-gray-800 dark:text-gray-200">XP: {profile.xp || 0}</Text>
        <Text className="text-lg text-gray-800 dark:text-gray-200 mt-1">🔥 Streak: {profile.streak || 0} days</Text>
        {profile.rank && (
          <Text className="text-base text-blue-500 dark:text-blue-400 font-medium mt-2">#{profile.rank} on leaderboard</Text>
        )}
      </View>

      {user && user.username !== profile.username && (
        <Pressable
          className={`rounded-lg py-3.5 items-center justify-center ${isFollowing ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-600 dark:bg-blue-700'}`}
          onPress={toggleFollow}
          disabled={followLoading}
        >
          {followLoading ? <ActivityIndicator color="#fff"/> :
            <Text className={`text-center font-semibold ${isFollowing? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          }
        </Pressable>
      )}
      {/* Placeholder for other user content like badges, completed challenges etc. */}
    </ScrollView>
  );
}
