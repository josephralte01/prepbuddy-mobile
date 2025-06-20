// app/(tabs)/profile.tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import { Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <ProtectedRoute>
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">Welcome to your Profile</Text>
      </View>
    </ProtectedRoute>
  );
}
