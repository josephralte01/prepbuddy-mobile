import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useAppStatus } from '@/lib/useAppStatus';
import Toast from 'react-native-toast-message';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { loading, startLoading, stopLoading, raiseError } = useAppStatus();
  const [emailSent, setEmailSent] = useState(false);

  const resendVerification = async () => {
    startLoading();
    try {
      await api.post('/api/auth/resend-verification', {}, { withCredentials: true });
      setEmailSent(true);
      Toast.show({
        type: 'success',
        text1: 'Verification email sent!',
        text2: 'Check your inbox or spam folder.',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to resend email';
      raiseError(msg);
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    } finally {
      stopLoading();
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-4">Verify Your Email</Text>
      <Text className="text-center text-gray-600 mb-6">
        We’ve sent a confirmation link to your email. Please verify to continue.
      </Text>

      <Pressable
        onPress={resendVerification}
        className="bg-blue-600 px-4 py-3 rounded-xl disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Resend Email</Text>
        )}
      </Pressable>

      {emailSent && (
        <Text className="text-green-600 mt-4">A new email has been sent!</Text>
      )}

      <Pressable onPress={() => router.replace('/auth/login')}>
        <Text className="text-blue-500 mt-6">Back to Login</Text>
      </Pressable>
    </View>
  );
}
