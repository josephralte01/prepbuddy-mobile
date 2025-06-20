import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useAppStatus } from '@/lib/useAppStatus';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const router = useRouter();
  const { loading, error, startLoading, stopLoading, raiseError } = useAppStatus();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    startLoading();
    try {
      await api.post(
        '/api/auth/register',
        { name, email, password },
        { withCredentials: true }
      );
      Toast.show({
        type: 'success',
        text1: 'Registration successful!',
        text2: 'Please check your email to verify your account.',
      });
      router.replace('/auth/login');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed';
      raiseError(msg);
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    } finally {
      stopLoading();
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-6 text-center">Create Account</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 p-3 mb-4 rounded-xl"
      />

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
        onPress={handleRegister}
        className="bg-green-600 p-3 rounded-xl disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Register</Text>
        )}
      </Pressable>

      {error && <Text className="text-red-500 mt-3 text-center">{error}</Text>}

      <Pressable onPress={() => router.push('/auth/login')}>
        <Text className="text-blue-500 text-center mt-5">Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}
