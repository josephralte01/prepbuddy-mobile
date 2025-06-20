import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!password || !confirm) {
      return Toast.show({ type: 'error', text1: 'All fields are required' });
    }
    if (password !== confirm) {
      return Toast.show({ type: 'error', text1: 'Passwords do not match' });
    }

    try {
      setLoading(true);
      await axios.post(
        `https://prepbuddy-backend.onrender.com/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      Toast.show({ type: 'success', text1: 'Password reset successful' });
      router.replace('/login');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.error || 'Failed to reset password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Reset Password</Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border rounded-xl px-4 py-3 mb-4"
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        className="border rounded-xl px-4 py-3 mb-6"
      />

      <Pressable
        className="bg-blue-600 p-4 rounded-xl"
        onPress={handleReset}
        disabled={loading}
      >
        <Text className="text-white text-lg text-center">
          {loading ? 'Resetting...' : 'Reset Password'}
        </Text>
      </Pressable>
    </View>
  );
}
