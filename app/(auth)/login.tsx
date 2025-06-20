import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'expo-router';
import { useAppStatus } from '@/lib/useAppStatus';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const router = useRouter();
  const { loading, error, startLoading, stopLoading, raiseError } = useAppStatus();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    startLoading();
    try {
      const res = await api.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true } // 🛡️ allows httpOnly cookie to be sent
      );

      Toast.show({ type: 'success', text1: 'Welcome back!' });
      router.replace('/'); // 🔁 Redirect to home or dashboard
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed';
      raiseError(message);
      Toast.show({ type: 'error', text1: 'Login Error', text2: message });
    } finally {
      stopLoading();
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-6 text-center">PrepBuddy Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 p-3 mb-4 rounded-xl"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 p-3 mb-4 rounded-xl"
      />

      <Pressable
        onPress={handleLogin}
        className="bg-blue-600 p-3 rounded-xl disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Login</Text>
        )}
      </Pressable>

      {error && <Text className="text-red-500 mt-3 text-center">{error}</Text>}

      <Pressable onPress={() => router.push('/auth/register')}>
        <Text className="text-blue-500 text-center mt-5">Don’t have an account? Register</Text>
      </Pressable>
    </View>
  );
}
