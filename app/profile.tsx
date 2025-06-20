// === app/profile.tsx ===
import { View, Text, ScrollView } from 'react-native';
import { useUser } from '@/lib/useUser';
import { ProgressBar } from 'react-native-paper';
import { Link } from 'expo-router';
import { getLevelBadge } from '@/lib/utils';
import { getHabitBadges } from '@/lib/getHabitBadges';

export default function ProfileScreen() {
  const { user } = useUser();

  const calculateLevel = (xp: number) => Math.floor(xp / 100);
  const level = calculateLevel(user?.xp || 0);
  const progressToNext = ((user?.xp || 0) % 100) / 100;

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
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-3xl font-bold mb-2 text-center">{user?.name}</Text>
      <Text className="text-gray-600 text-center mb-4">{user?.email}</Text>

      <View className="items-center my-6">
        <Text className="text-xl font-semibold">🏅 Level {level}</Text>
        {user?.rank && (
          <Text className="text-sm text-blue-600 font-medium mt-1">#{user.rank} on leaderboard</Text>
        )}
        <Text className="text-sm text-gray-500 mb-1">XP: {user?.xp || 0}</Text>
        <ProgressBar
          progress={progressToNext}
          color="#3B82F6"
          style={{ width: '80%', height: 8, borderRadius: 10 }}
        />
      </View>

      <View className="my-4">
        <Text className="text-lg font-semibold mb-2">🔥 Current Streak</Text>
        <Text className="text-base text-gray-700">{user?.streak || 0} days</Text>
      </View>

      <View className="my-4">
        <Text className="text-lg font-semibold mb-2">🏆 Badges</Text>
        {badges.length > 0 ? (
          badges.map((badge, idx) => (
            <Text
              key={idx}
              className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mb-2 w-fit"
            >
              {badge}
            </Text>
          ))
        ) : (
          <Text className="text-gray-500">No badges earned yet</Text>
        )}
      </View>

      <View className="items-center mt-4">
        <Link href="/profile/xp-history" className="text-blue-500 text-sm underline">
          View XP History →
        </Link>
      </View>
    </ScrollView>
  );
}
