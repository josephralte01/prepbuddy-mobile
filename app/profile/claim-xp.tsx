import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../../hooks/useUser';
import api from '../../lib/api';
import { useRouter } from 'expo-router';

export default function ClaimXPBadgeScreen() {
  const { user, refetch } = useUser();
  const [rewards, setRewards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get('/xp/rewards');
        setRewards(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRewards();
  }, []);

  const handleClaim = async (rewardId: string) => {
    try {
      const res = await api.post(`/xp/claim/${rewardId}`);
      Alert.alert('🎉 XP Claimed', res.data.message || 'You earned XP!');
      refetch();
      setRewards(rewards.filter(r => r._id !== rewardId));
    } catch (err) {
      Alert.alert('Error', 'Could not claim XP reward.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎖️ Claim XP Rewards</Text>
      {rewards.length === 0 ? (
        <Text style={styles.subText}>No unclaimed XP badges available.</Text>
      ) : (
        rewards.map((reward) => (
          <View key={reward._id} style={styles.card}>
            <Text style={styles.title}>{reward.title}</Text>
            <Text style={styles.desc}>{reward.description}</Text>
            <TouchableOpacity
              style={styles.claimBtn}
              onPress={() => handleClaim(reward._id)}
            >
              <Text style={styles.claimText}>Claim {reward.xp} XP</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  subText: {
    color: '#777',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  claimBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimText: {
    color: '#fff',
    fontWeight: '600',
  },
});
