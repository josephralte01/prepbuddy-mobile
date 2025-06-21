import { View, Text, FlatList, Pressable, ActivityIndicator, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/user/useUser'; // Updated path
import { useRouter, Link } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useLeaderboard } from '@/hooks/leaderboard/useLeaderboard'; // Import the hook

export default function LeaderboardScreen() {
  const { user } = useUser();
  const router = useRouter();
  // const [users, setUsers] = useState<any[]>([]); // Will come from useLeaderboard
  const [following, setFollowing] = useState<string[]>([]); // Keep for follow/unfollow UI updates
  const [suggestions, setSuggestions] = useState<any[]>([]); // Keep for suggestions
  // const [loading, setLoading] = useState(true); // Will come from useLeaderboard

  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const { leaderboard: users, isLoading: loadingLeaderboard, isError: leaderboardError } = useLeaderboard(timeframe);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});


  useEffect(() => {
    // Fetch user's following list and generate suggestions when user or leaderboard data changes
    const fetchFollowingAndSuggestions = async () => {
      if (user && users.length > 0) {
        try {
          const fRes = await api.get('/social/following');
          const followingList = fRes.data.map((u: any) => u.username);
          setFollowing(followingList);

          const suggestionsList = users.filter(
            (u: any) => u.username !== user.username && !followingList.includes(u.username)
          ).slice(0, 5);
          setSuggestions(suggestionsList);
        } catch (error) {
          console.error('Failed to fetch following list:', error);
          // Not showing a toast here as leaderboard is still functional
        }
      } else if (!user) {
        // Clear suggestions if user logs out
        setSuggestions([]);
        setFollowing([]);
      }
    };

    fetchFollowingAndSuggestions();
  }, [user, users]); // users is now from useLeaderboard

  useEffect(() => {
    // Animation for when leaderboard data (users) changes
    if (users.length > 0) {
      fadeAnim.setValue(0); // Reset animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [users, fadeAnim]);

  const toggleFollow = async (usernameToToggle: string) => {
    if (!user) {
      Toast.show({ type: 'info', text1: 'Login Required', text2: 'Please login to follow users.' });
      return;
    }
    setFollowLoading(prev => ({ ...prev, [usernameToToggle]: true }));
    const route = following.includes(usernameToToggle) ? 'unfollow' : 'follow';
    try {
      await api.post(`/social/${route}/${usernameToToggle}`); // Removed /api prefix
      setFollowing((prev) =>
        route === 'follow' ? [...prev, usernameToToggle] : prev.filter((u) => u !== usernameToToggle)
      );
      Toast.show({type: 'success', text1: route === 'follow' ? 'Followed!' : 'Unfollowed!', text2: `${route === 'follow' ? 'Now following' : 'No longer following'} @${usernameToToggle}`});
    } catch (err: any) {
      console.error('Error updating follow:', err.response?.data || err.message);
      Toast.show({type: 'error', text1: 'Error', text2: 'Could not update follow status.'});
    } finally {
      setFollowLoading(prev => ({ ...prev, [usernameToToggle]: false }));
    }
  };

  const calculateLevelProgress = (xp: number) => (xp % 100) / 100;

   // Render loading state from useLeaderboard
   if (loadingLeaderboard) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

   // Handle error state from useLeaderboard
   if (leaderboardError) {
       return (
           <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
               <Text className="text-red-500 text-center">Failed to load leaderboard. Please try again later.</Text>
           </View>
       )
   }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-6">
       <Text className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">🏆 Leaderboard</Text>

       {/* Timeframe selection buttons */}
       <View className="flex-row justify-center gap-x-2 mb-6">
         {(['all', 'month', 'week'] as const).map((tf) => (
           <Pressable
             key={tf}
             onPress={() => setTimeframe(tf)}
             className={`px-4 py-2 rounded-full border ${
               timeframe === tf
                 ? 'bg-blue-600 dark:bg-blue-700 border-blue-600 dark:border-blue-700'
                 : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
             }`}
           >
             <Text className={`font-medium capitalize ${timeframe === tf ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
               {tf}
             </Text>
           </Pressable>
         ))}
       </View>

       {suggestions.length > 0 && user && (
        <View className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">🔍 People You May Want to Follow</Text>
           {suggestions.map((item: any) => (
            <View
              key={item._id}
              className="flex-row justify-between items-center bg-yellow-50 dark:bg-yellow-800/30 rounded-xl p-3 mb-2"
            >
              <Link href={`/profile/${item.username}`} asChild>
                <Pressable>
                  <Text className="font-medium text-base text-blue-600 dark:text-blue-400">{item.name}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">@{item.username} • {item.xp} XP</Text>
                </Pressable>
              </Link>
              <Pressable
                onPress={() => toggleFollow(item.username)}
                disabled={followLoading[item.username]}
                className={`rounded-full px-4 py-2 ${followLoading[item.username] ? 'bg-gray-400' : 'bg-blue-600 dark:bg-blue-700'}`}
              >
                {followLoading[item.username] ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-white text-sm font-medium">Follow</Text>}
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }: { item: any }) => { // Define type for item
          const progress = calculateLevelProgress(item.xp);
          const isCurrentUserFollowing = user ? following.includes(item.username) : false;
          const isLoadingFollow = user ? followLoading[item.username] : false;

          return (
            <Animated.View
              style={{ opacity: fadeAnim }}
              className="flex-row justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow"
            >
              <Link href={`/profile/${item.username}`} asChild>
                <Pressable className="flex-1 mr-2">
                  <Text className="font-medium text-base text-blue-600 dark:text-blue-400">{item.name}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">@{item.username} • {item.xp} XP • #{item.rank}</Text>
                  <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1.5 w-full max-w-xs">
                    <View
                      className="h-2 bg-blue-500 dark:bg-blue-600 rounded-full"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </View>
                </Pressable>
              </Link>

              {user && user.username !== item.username && (
                <Pressable
                  onPress={() => toggleFollow(item.username)}
                  disabled={isLoadingFollow}
                  className={`rounded-full px-4 py-2 w-28 items-center justify-center h-10 ${
                    isLoadingFollow ? 'bg-gray-400' : (isCurrentUserFollowing ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-600 dark:bg-blue-700')
                  }`}
                >
                  {isLoadingFollow ? <ActivityIndicator size="small" color={isCurrentUserFollowing ? "#000" : "#fff"} /> :
                    <Text className={`font-medium text-sm ${isCurrentUserFollowing ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                      {isCurrentUserFollowing ? 'Unfollow' : 'Follow'}
                    </Text>
                  }
                </Pressable>
              )}
            </Animated.View>
          );
        }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">Leaderboard is empty or failed to load.</Text>
        }
      />
    </View>
  );
}
