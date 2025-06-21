import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useUpdateChallengeStatus } from '@/hooks/challenges/useUpdateChallengeStatus'; // Correct import
import Toast from 'react-native-toast-message';

// Define a basic Challenge type, this should match your actual data structure
interface Challenge {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'failed'; // Example statuses
  xpReward: number;
  createdBy?: { name: string, username: string }; // Example
  // Add other relevant fields: endsAt, participants, etc.
}

interface ChallengeCardProps {
  challenge: Challenge;
  onRefresh?: () => void; // Callback to refresh the list after an update
}

export default function ChallengeCard({ challenge, onRefresh }: ChallengeCardProps) {
  const { mutate: updateStatus, isLoading: isUpdating } = useUpdateChallengeStatus();

  const handleUpdateStatus = (newStatus: Challenge['status']) => {
    updateStatus(
      { challengeId: challenge._id, status: newStatus },
      {
        onSuccess: () => {
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{challenge.title}</Text>
      <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">{challenge.description}</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status: <Text className="font-medium capitalize">{challenge.status}</Text></Text>
      <Text className="text-sm text-yellow-500 dark:text-yellow-400 mb-3">XP Reward: {challenge.xpReward}</Text>

      {/* Example action buttons based on status */}
      {challenge.status === 'pending' && (
        <View className="flex-row gap-x-2 mt-2">
          <Pressable
            onPress={() => handleUpdateStatus('accepted')}
            disabled={isUpdating}
            className={`flex-1 py-2 px-3 rounded-md items-center ${isUpdating ? 'bg-gray-400' : 'bg-green-500 dark:bg-green-600'}`}
          >
            <Text className="text-white font-semibold">Accept</Text>
          </Pressable>
          <Pressable
            onPress={() => handleUpdateStatus('declined')}
            disabled={isUpdating}
            className={`flex-1 py-2 px-3 rounded-md items-center ${isUpdating ? 'bg-gray-400' : 'bg-red-500 dark:bg-red-600'}`}
          >
            <Text className="text-white font-semibold">Decline</Text>
          </Pressable>
        </View>
      )}
      {challenge.status === 'accepted' && (
         <Pressable
            onPress={() => handleUpdateStatus('completed')} // This might need proof, etc.
            disabled={isUpdating}
            className={`mt-2 py-2 px-3 rounded-md items-center ${isUpdating ? 'bg-gray-400' : 'bg-blue-500 dark:bg-blue-600'}`}
          >
            <Text className="text-white font-semibold">Mark as Completed</Text>
          </Pressable>
      )}
      {/* Add more conditional UI for other statuses */}
    </View>
  );
}
