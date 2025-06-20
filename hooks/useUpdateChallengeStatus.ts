// === prepbuddy-mobile/hooks/useUpdateChallengeStatus.ts ===
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useUpdateChallengeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challengeId, status }: { challengeId: string; status: string }) => {
      const res = await api.put(`/api/challenges/${challengeId}/status`, { status });
      return res.data;
    },
    onMutate: async ({ challengeId, status }) => {
      await queryClient.cancelQueries(['userChallenges']);

      const previous = queryClient.getQueryData(['userChallenges']);

      queryClient.setQueryData(['userChallenges'], (old: any) =>
        old?.map((c: any) =>
          c._id === challengeId ? { ...c, status } : c
        )
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['userChallenges'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['userChallenges']);
    }
  });
};
