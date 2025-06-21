import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { api } from '@/lib/api'; // Use centralized API
import Toast from 'react-native-toast-message';
import { useRouter, Link } from 'expo-router'; // Added Link

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Email is required' });
      return;
    }
    try {
      setLoading(true);
      // Replaced axios.post with api.post and removed base URL
      await api.post('/auth/forgot-password', { email });
      Toast.show({
        type: 'success',
        text1: 'Password Reset Link Sent!',
        text2: 'Please check your email to reset your password.'
      });
      router.push('/auth/login'); // Adjusted path to new login screen
    } catch (err: any) { // Added type for err
      Toast.show({ type: 'error', text1: err.response?.data?.error || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 justify-center bg-gray-50 dark:bg-gray-900">
      <Text className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">Forgot Password?</Text>
      <Text className="text-center text-gray-600 dark:text-gray-400 mb-8">
        No worries! Enter your email below and we'll send you a link to reset it.
      </Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 mb-6 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Pressable
        onPress={handleSubmit}
        className="bg-blue-600 dark:bg-blue-700 rounded-xl py-4 items-center justify-center h-14" // Fixed height for consistency
        disabled={loading || !email}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">
            Send Reset Link
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
