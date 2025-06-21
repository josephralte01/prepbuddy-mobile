import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter, useLocalSearchParams, Link } from 'expo-router'; // Added Link and useLocalSearchParams
import { api } from '@/lib/api';
// import { useAppStatus } from '@/lib/useAppStatus'; // Consider removing if local state is enough
import Toast from 'react-native-toast-message';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>(); // Get email from params if passed
  // const { loading, startLoading, stopLoading, raiseError } = useAppStatus(); // Replaced with local loading
  const [loading, setLoading] = useState(false);
  const [resentLoading, setResentLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Optional: Attempt to verify token if one is passed in URL (e.g. from email link)
  // This depends on backend setup for deep linking verification
  // const { token } = useLocalSearchParams<{ token?: string }>();
  // useEffect(() => {
  //   if (token) {
  //     const verifyToken = async () => {
  //       setLoading(true);
  //       try {
  //         await api.post(`/auth/verify-email/${token}`);
  //         Toast.show({ type: 'success', text1: 'Email Verified!', text2: 'You can now login.' });
  //         router.replace('/auth/login');
  //       } catch (err: any) {
  //         Toast.show({ type: 'error', text1: 'Verification Failed', text2: err.response?.data?.message || 'Invalid or expired token.' });
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     verifyToken();
  //   }
  // }, [token, router]);


  const resendVerification = async () => {
    setResentLoading(true);
    setMessage('');
    try {
      // Pass email if available, otherwise backend might use current session
      const payload = email ? { email } : {};
      await api.post('/auth/resend-verification', payload);
      setMessage('Verification email sent! Check your inbox (and spam folder).');
      Toast.show({
        type: 'success',
        text1: 'Verification Email Sent!',
        text2: 'Please check your email to continue.',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to resend verification email.';
      setMessage(msg); // Show error locally
      Toast.show({ type: 'error', text1: 'Error Resending', text2: msg });
    } finally {
      setResentLoading(false);
    }
  };

  // If loading from a token verification attempt
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-lg text-gray-700 dark:text-gray-300 mt-4">Verifying...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
      <View className="w-full max-w-md">
        <Text className="text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">Verify Your Email</Text>
        <Text className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {`We've sent a confirmation link to ${email ? email : 'your email address'}. Please click the link in the email to activate your account.`}
        </Text>

        {message && (
          <Text className={`text-center mb-6 ${message.startsWith('Failed') ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {message}
          </Text>
        )}

        <Pressable
          onPress={resendVerification}
          className="bg-blue-600 dark:bg-blue-700 py-3.5 rounded-xl items-center justify-center h-14 w-full mb-6"
          disabled={resentLoading}
        >
          {resentLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">Resend Verification Email</Text>
          )}
        </Pressable>

        <Link href="/auth/login" asChild>
          <Pressable className="py-2">
            <Text className="text-center text-blue-600 dark:text-blue-400 font-medium">
              Back to Login
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
