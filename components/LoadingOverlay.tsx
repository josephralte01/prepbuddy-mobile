import { View, ActivityIndicator } from 'react-native';

export default function LoadingOverlay() {
  return (
    <View className="absolute inset-0 z-50 bg-white/80 justify-center items-center">
      <ActivityIndicator size="large" color="#0072F5" />
    </View>
  );
}
