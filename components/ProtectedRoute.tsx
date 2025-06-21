import { useUser } from '@/hooks/user/useUser'; // Updated path
import { Redirect } from 'expo-router';
import { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return <>{children}</>;
}
