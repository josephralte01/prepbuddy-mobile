// === components/ChallengeCompletedModal.tsx ===
import { Modal, View, Text, Pressable } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ChallengeCompletedModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-xl p-6 w-11/12 max-w-md items-center">
          <Text className="text-xl font-bold mb-2">🎉 Challenge Completed!</Text>
          <Text className="text-base text-gray-700 mb-4 text-center">You've earned bonus XP. Great job!</Text>

          <Pressable
            onPress={onClose}
            className="bg-blue-600 px-4 py-2 rounded-full mt-2"
          >
            <Text className="text-white font-semibold">Claim Reward</Text>
          </Pressable>
        </View>
        <ConfettiCannon count={80} origin={{ x: 200, y: -10 }} fadeOut autoStart />
      </View>
    </Modal>
  );
}
