// === prepbuddy-mobile/hooks/challenges/useUpdateChallengeStatus.ts ===
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Toast from 'react-native-toast-message';

interface UpdateChallengePayload {
  challengeId: string;
  status: 'accepted' | 'declined' | 'completed' | 'failed'; // Example statuses
  // Add other relevant fields if needed, e.g., proofOfCompletion for 'completed'
}

// Define expected response type if known
interface UpdateChallengeResponse {
  message: string;
  challenge: any; // Define a proper Challenge type
  xpEarned?: number;
}

export const useUpdateChallengeStatus = () = {
  const queryClient = useQueryClient();

  return useMutation<UpdateChallengeResponse, Error, UpdateChallengePayload>(
    async ({ challengeId, status }: UpdateChallengePayload) => {
      const res = await api.put(`/challenges/${challengeId}/status`, { status }); // Removed /api prefix
      return res.data;
    },
    {
      onMutate: async (variables) => {
        const { challengeId, status } = variables;
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ['challenges'] }); // General challenges list
        await queryClient.cancelQueries({ queryKey: ['challenge', challengeId] }); // Specific challenge

        // Snapshot the previous value for general challenges list
        const previousChallenges = queryClient.getQueryData(['challenges']);
        // Snapshot previous value for individual challenge
        const previousChallenge = queryClient.getQueryData(['challenge', challengeId]);

        // Optimistically update to the new value for general list
        if (previousChallenges) {
          queryClient.setQueryData(['challenges'], (old: any[] | undefined) =>
            old?.map((c: any) =>
              c._id === challengeId ? { ...c, status: status } : c
            )
          );
        }
        // Optimistically update individual challenge
        if (previousChallenge) {
            queryClient.setQueryData(['challenge', challengeId], (old: any | undefined) =>
                old ? { ...old, status: status } : undefined
            );
        }

        return { previousChallenges, previousChallenge, challengeId };
      },
      onError: (err: any, variables, context) => {
        // Rollback on error
        if (context?.previousChallenges) {
          queryClient.setQueryData(['challenges'], context.previousChallenges);
        }
        if (context?.previousChallenge) {
            queryClient.setQueryData(['challenge', context.challengeId], context.previousChallenge);
        }
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: err.response?.data?.message || 'Could not update challenge status.'
        });
      },
      onSuccess: (data, variables) => {
        Toast.show({
            type: 'success',
            text1: 'Challenge Updated!',
            text2: data.message || `Status changed to ${variables.status}.`
        });
        if (data.xpEarned) {
            Toast.show({ type: 'info', text1: 'XP Earned!', text2: `+${data.xpEarned} XP`});
        }
      },
      onSettled: (data, error, variables) => {
        // Always refetch after error or success to ensure server state
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
        queryClient.invalidateQueries({ queryKey: ['challenge', variables.challengeId] });
        // Potentially invalidate user profile/XP if status update grants XP
        if (data?.xpEarned || variables.status === 'completed') {
             queryClient.invalidateQueries({ queryKey: ['user'] }); // Assuming 'user' is key for useUser
        }
      }
    }
  );
};
