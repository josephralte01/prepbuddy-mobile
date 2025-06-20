// 📁 screens/ProfileScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUser } from '../hooks/useUser';
import { getLevelBadge } from '../lib/utils';
import { getHabitBadges } from '../lib/getHabitBadges';
import ProgressBar from '../components/ProgressBar';
import { useNavigation } from 'expo-router';
import ConfettiEffect from '../components/ConfettiEffect';

export default function ProfileScreen() {
  const { user, refetch } = useUser();
  const navigation = useNavigation();
  const [showConfetti, setShowConfetti] = useState(false);

  const calculateLevel = (xp: number) => Math.floor(xp / 100);
  const level = calculateLevel(user?.xp || 0);
  const progressToNext = ((user?.xp || 0) % 100) / 100;

  const previousLevel = useRef(level);
  useEffect(() => {
    if (level > previousLevel.current) {
      setShowConfetti(true);
      previousLevel.current = level;
    }
  }, [level]);

  const handleRecoverStreak = async () => {
    try {
      const res = await fetch(`/api/streak/recover`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Streak Recovered', 'Your streak has been restored!');
        refetch();
      } else {
        Alert.alert('Failed', data.error || 'Recovery failed.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏅 Level {level}</Text>
        {user?.rank && (
          <Text style={styles.rankText}>#{user.rank} on leaderboard</Text>
        )}
        <Text style={styles.xpText}>XP: {user?.xp || 0}</Text>
        <ProgressBar progress={progressToNext} />
        <Text style={styles.subText}>{Math.floor(progressToNext * 100)}% to next level</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Current Streak</Text>
        <Text style={styles.subText}>{user?.streak || 0} days</Text>
        {user?.canRecoverStreak && (
          <TouchableOpacity onPress={handleRecoverStreak} style={styles.recoverBtn}>
            <Text style={styles.recoverText}>Recover Streak</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎖️ Badges</Text>
        {badges.length > 0 ? (
          <View style={styles.badgeContainer}>
            {badges.map((badge, idx) => (
              <Text key={idx} style={styles.badge}>
                {badge}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.subText}>No badges earned yet</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('profile/xp-history')}
      >
        <Text style={styles.linkText}>View XP History →</Text>
      </TouchableOpacity>

      <ConfettiEffect trigger={showConfetti} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  rankText: {
    fontSize: 14,
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 6,
  },
  xpText: {
    textAlign: 'center',
    marginBottom: 6,
    color: '#444',
  },
  subText: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  link: {
    alignSelf: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
  },
  recoverBtn: {
    backgroundColor: '#e0f2fe',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginTop: 10,
    alignSelf: 'center',
  },
  recoverText: {
    color: '#0284c7',
    fontWeight: '600',
    fontSize: 14,
  },
});
<TouchableOpacity
  style={styles.link}
  onPress={() => navigation.navigate('profile/claim-xp')}
>
  <Text style={styles.linkText}>🎖️ Claim XP Badges</Text>
</TouchableOpacity>
