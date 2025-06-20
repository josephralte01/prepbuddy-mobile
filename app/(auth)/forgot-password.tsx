import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) return Toast.show({ type: 'error', text1: 'Email is required' });
    try {
      setLoading(true);
      await axios.post('https://prepbuddy-backend.onrender.com/api/auth/forgot-password', { email }, { withCredentials: true });
      Toast.show({ type: 'success', text1: 'Reset link sent!' });
      router.push('/login');
    } catch (err) {
      Toast.show({ type: 'error', text1: err.response?.data?.error || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 justify-center">
      <Text className="text-2xl font-bold mb-4 text-center">Forgot Password</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        className="border rounded-xl px-4 py-3 mb-4"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Pressable
        onPress={handleSubmit}
        className="bg-blue-600 rounded-xl p-4"
        disabled={loading}
      >
        <Text className="text-white text-center text-lg">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </Pressable>
    </View>
  );
}
