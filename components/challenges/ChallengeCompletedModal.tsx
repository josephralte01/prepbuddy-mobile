// === components/challenges/ChallengeCompletedModal.tsx ===
import { Modal, View, Text, Pressable } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon'; // This is fine

export default function ChallengeCompletedModal({
  visible,
  onClose,
  xpEarned
}: {
  visible: boolean;
  onClose: () => void;
  xpEarned?: number; // Made XP dynamic
}) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60 p-4">
        <View className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm items-center shadow-2xl">
          <Text className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">🎉 Challenge Completed!</Text>
          <Text className="text-base text-gray-700 dark:text-gray-300 mb-5 text-center">
            {xpEarned ? `You've earned ${xpEarned} bonus XP!` : "You've successfully completed the challenge!"} Great job!
          </Text>

          <Pressable
            onPress={onClose}
            className="bg-blue-600 dark:bg-blue-700 px-6 py-3 rounded-lg mt-2 shadow-md active:opacity-80"
          >
            <Text className="text-white font-semibold text-lg">Awesome!</Text>
          </Pressable>
        </View>
        {/* Confetti should only render when modal is visible to avoid issues */}
        {visible && <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} autoStart fadeOut />}
      </View>
    </Modal>
  );
}
