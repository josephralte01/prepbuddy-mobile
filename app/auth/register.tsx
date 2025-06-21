import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { api } from '@/lib/api';
// import { useAppStatus } from '@/lib/useAppStatus'; // Replaced with local state
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state
  const [formError, setFormError] = useState<string | null>(null); // Local error state

  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Name is required.' });
      return false;
    }
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Email is required.' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Email is invalid.' });
      return false;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Password must be at least 6 characters.' });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setFormError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      Toast.show({
        type: 'success',
        text1: 'Registration Successful!',
        text2: 'Please check your email to verify your account.',
        visibilityTime: 5000,
      });
      // Pass email to verify screen so it can show "email sent to user@example.com"
      router.replace({ pathname: '/auth/verify', params: { email } });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Registration failed. Please try again.';
      setFormError(msg);
      Toast.show({ type: 'error', text1: 'Registration Error', text2: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-gray-50 dark:bg-gray-900">
      <Text className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">Create Your Account</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 mb-4 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 mb-4 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />

      <TextInput
        placeholder="Password (min. 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 mb-6 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />

      <Pressable
        onPress={handleRegister}
        className="bg-green-600 dark:bg-green-700 p-4 rounded-xl items-center justify-center h-14"
        disabled={isLoading} // Use local isLoading
      >
        {isLoading ? ( // Use local isLoading
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">Create Account</Text>
        )}
      </Pressable>

      {formError && <Text className="text-red-500 dark:text-red-400 mt-4 text-center">{formError}</Text>}

      <Link href="/auth/login" asChild>
        <Pressable className="mt-8 py-2">
          <Text className="text-center text-blue-600 dark:text-blue-400 font-medium">
            Already have an account? Login
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
