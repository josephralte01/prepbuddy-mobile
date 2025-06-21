import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { api } from '@/lib/api'; // Use centralized API
import Toast from 'react-native-toast-message';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Both password fields are required.' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Password must be at least 6 characters.' });
      return;
    }
    if (!token) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Reset token is missing. Please try the link again.'});
        return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, { password });
      Toast.show({
        type: 'success',
        text1: 'Password Reset Successful!',
        text2: 'You can now login with your new password.',
        visibilityTime: 4000,
      });
      router.replace('/auth/login'); // Adjusted path
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: err.response?.data?.error || err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <Text className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">Set New Password</Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 mb-4 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 mb-8 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />

      <Pressable
        onPress={handleResetPassword}
        className="bg-blue-600 dark:bg-blue-700 rounded-xl py-4 items-center justify-center h-14"
        disabled={loading || !password || !confirmPassword}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">
            Reset Password
          </Text>
        )}
      </Pressable>
      <Link href="/auth/login" asChild>
        <Pressable className="mt-8 py-2">
          <Text className="text-center text-blue-600 dark:text-blue-400 font-medium">
            Back to Login
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
