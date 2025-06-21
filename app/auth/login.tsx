import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter, Link } from 'expo-router';
// import { useAppStatus } from '@/lib/useAppStatus'; // Replaced with local state
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state
  const [formError, setFormError] = useState<string | null>(null); // Local error state

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Email and password are required.' });
      return;
    }
    setFormError(null); // Clear previous form errors
    setIsLoading(true);
    try {
      // The useAuthStore().setUser should ideally be called within a centralized auth service/hook after successful login
      // For now, assuming api.post to /auth/login also sets user state via cookie or global store listener.
      const response = await api.post('/auth/login', { email, password });

      // If backend explicitly returns user data or success status, use it.
      // Example: if (response.data.user) { useAuthStore.getState().setUser(response.data.user); }

      Toast.show({ type: 'success', text1: 'Welcome back!' });
      router.replace('/(tabs)');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.response?.data?.error || 'Login failed. Please check your credentials.';
      setFormError(message); // Display error locally on the form
      Toast.show({ type: 'error', text1: 'Login Error', text2: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-gray-50 dark:bg-gray-900">
      <Text className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">Welcome Back!</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 mb-4 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 mb-6 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />

      <Pressable
        onPress={handleLogin}
        className="bg-blue-600 dark:bg-blue-700 p-4 rounded-xl items-center justify-center h-14"
        disabled={isLoading} // Use local isLoading
      >
        {isLoading ? ( // Use local isLoading
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">Login</Text>
        )}
      </Pressable>

      {formError && <Text className="text-red-500 dark:text-red-400 mt-4 text-center">{formError}</Text>}

      <View className="flex-row justify-between items-center mt-6">
        <Link href="/auth/forgot-password" asChild>
          <Pressable>
            <Text className="text-blue-600 dark:text-blue-400">Forgot Password?</Text>
          </Pressable>
        </Link>
        <Link href="/auth/register" asChild>
          <Pressable>
            <Text className="text-blue-600 dark:text-blue-400 font-medium">Create Account</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
