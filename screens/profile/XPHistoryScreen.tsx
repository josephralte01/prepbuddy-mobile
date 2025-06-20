// screens/profile/XPHistoryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useUser } from '../../hooks/useUser';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';

export default function XPHistoryScreen() {
  const { user } = useUser();
  const [xpLogs, setXpLogs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchXPLogs = async () => {
        try {
          const res = await fetch('/api/xp-logs/me');
          const data = await res.json();
          setXpLogs(data);
        } catch (err) {
          console.error('Failed to fetch XP logs:', err);
        }
      };
      fetchXPLogs();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>XP History</Text>
      <Text style={styles.subText}>Total XP: {user?.xp || 0}</Text>
      <FlatList
        data={xpLogs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text style={styles.logAction}>{item.action}</Text>
            <Text style={styles.logXP}>+{item.xp} XP</Text>
            <Text style={styles.logTime}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.subText}>No XP history yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subText: { color: '#666', marginBottom: 12 },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  logAction: { fontWeight: '600' },
  logXP: { color: '#22c55e' },
  logTime: { fontSize: 12, color: '#888' },
});
