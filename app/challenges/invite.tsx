// === app/challenges/invite.tsx ===
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ChallengeInviteScreen() {
  const router = useRouter();
  const [goalXP, setGoalXP] = useState('100');
  const [usernames, setUsernames] = useState(['']);
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/challenges', {
        type: usernames.length === 1 ? '1v1' : 'group',
        goalXP: parseInt(goalXP),
        participantIds: usernames
      });
      Alert.alert('Challenge sent!');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to send challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-2xl font-bold mb-4">Invite to Challenge</Text>

        <Text className="mb-1 font-medium">Target XP</Text>
        <TextInput
          value={goalXP}
          onChangeText={setGoalXP}
          keyboardType="numeric"
          className="border px-3 py-2 rounded mb-4"
        />

        {usernames.map((u, i) => (
          <TextInput
            key={i}
            value={u}
            onChangeText={(text) => {
              const updated = [...usernames];
              updated[i] = text;
              setUsernames(updated);
            }}
            placeholder="Enter username"
            className="border px-3 py-2 rounded mb-3"
          />
        ))}

        <Button
          title="+ Add another participant"
          onPress={() => setUsernames([...usernames, ''])}
        />

        <View className="mt-6">
          <Button title={loading ? 'Sending...' : 'Send Challenge'} onPress={handleInvite} disabled={loading} />
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}
