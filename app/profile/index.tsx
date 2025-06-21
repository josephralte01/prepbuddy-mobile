// 📁 screens/ProfileScreen.tsx
// 📁 screens/ProfileScreen.tsx -> app/profile/index.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUser } from '@/hooks/user/useUser'; // Updated path
import { getLevelBadge } from '@/lib/utils';
import { getHabitBadges } from '@/lib/getHabitBadges';
import XPProgressBar from '@/components/profile/XPProgressBar'; // Updated path
import { useRouter, Link } from 'expo-router';
import ConfettiEffect from '@/components/ConfettiEffect';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';

// TODO: Adjust import paths for hooks, utils, components if they move to domain folders in Step 2
// TODO: Ensure ProgressBar component is correctly imported and handles dark mode if necessary

export default function ProfileScreen() {
  const { user, refetch } = useUser();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  const calculateLevel = (xp: number) => Math.floor(xp / 100);
  const level = calculateLevel(user?.xp || 0);
  const progressToNext = ((user?.xp || 0) % 100) / 100;

  const previousLevel = useRef(level);
  useEffect(() => {
    if (user && level > previousLevel.current) {
      setShowConfetti(true);
      previousLevel.current = level;
    }
  }, [level, user]);

  const handleRecoverStreak = async () => {
    try {
      const data = await api.post('/streak/recover');
      if (data.data.success) { // Assuming backend returns {success: true} inside data
        Alert.alert('Streak Recovered', 'Your streak has been restored!');
        refetch();
      } else {
        Alert.alert('Failed', data.data.error || 'Recovery failed.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong.');
    }
  };

  const badges: string[] = [];

  if ((user?.streak || 0) >= 7) badges.push('🔥 7-day Streak');
  if (user?.rank && user.rank <= 10) badges.push('🏆 Top 10');
  if ((user?.xp || 0) >= 1000) badges.push('🥇 1000+ XP Club');

  const levelBadge = getLevelBadge(user?.xp || 0);
  if (levelBadge) badges.push(levelBadge);

  const habitBadges = getHabitBadges(user?.habitProgress || {});
  badges.push(...habitBadges);

  if (user?.completedChallenges?.length) {
    badges.push('🎯 Challenge Master');
  }

  return (
    <ProtectedRoute>
      <ScrollView contentContainerClassName="p-4 pb-10 bg-gray-50 dark:bg-gray-900">
        <Text className="text-2xl font-bold text-center mb-1 text-gray-900 dark:text-white">{user?.name}</Text>
        <Text className="text-center text-gray-600 dark:text-gray-400 mb-4">{user?.email}</Text>

        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-white">🏅 Level {level}</Text>
          {user?.rank && (
            <Text className="text-sm text-blue-500 text-center mb-1.5">#{user.rank} on leaderboard</Text>
          )}
          <Text className="text-center mb-1.5 text-gray-700 dark:text-gray-300">XP: {user?.xp || 0}</Text>
          <XPProgressBar xp={user?.xp || 0} />
          {/* This text is now redundant as XPProgressBar shows level and progress */}
          {/* <Text className="text-gray-600 dark:text-gray-400 text-xs text-center mt-1">{Math.floor(progressToNext * 100)}% to next level</Text> */}
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-white">🔥 Current Streak</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs text-center mt-1">{user?.streak || 0} days</Text>
          {user?.canRecoverStreak && (
            <TouchableOpacity onPress={handleRecoverStreak} className="bg-blue-100 dark:bg-blue-700 py-2 px-4 rounded-full mt-2.5 self-center">
              <Text className="text-blue-600 dark:text-blue-200 font-semibold text-sm">Recover Streak</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-white">🎖️ Badges</Text>
          {badges.length > 0 ? (
            <View className="flex-row flex-wrap gap-2 mt-2 justify-center">
              {badges.map((badge, idx) => (
                <Text key={idx} className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs dark:bg-yellow-700 dark:text-yellow-200">
                  {badge}
                </Text>
              ))}
            </View>
          ) : (
            <Text className="text-gray-600 dark:text-gray-400 text-xs text-center mt-1">No badges earned yet</Text>
          )}
        </View>

        <Link href="/profile/xp-history" asChild>
          <TouchableOpacity className="self-center mt-2 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <Text className="text-blue-600 dark:text-blue-300 text-sm">View XP History →</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/profile/claim-xp" asChild>
          <TouchableOpacity className="self-center mt-2 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <Text className="text-blue-600 dark:text-blue-300 text-sm">🎖️ Claim XP Badges</Text>
          </TouchableOpacity>
        </Link>

        <ConfettiEffect trigger={showConfetti} />
      </ScrollView>
    </ProtectedRoute>
  );
}
