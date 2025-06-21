import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Toast from "react-native-toast-message";

// Define interfaces for better type safety
interface Habit {
  _id: string;
  title: string;
  description?: string;
  frequency?: string;
  xpReward?: number;
  // Add other habit properties as needed
}

interface HabitsData {
  habits: Habit[];
  streak: number;
  dailyCompleted: boolean; // Assuming this means all daily habits are done
  rewardClaimed: boolean; // For a potential daily completion bonus
  // progressMap might be better handled directly by the component if it's complex
  // or derived from habits data if habits include their own progress
}

export default function useHabits() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<HabitsData, Error, HabitsData>(
    {
      queryKey: ["habits"],
      queryFn: async () => {
        // This endpoint should ideally return all necessary info:
        // habits list, overall streak, daily completion status, etc.
        const res = await api.get("/habits/me");
        return res.data;
      },
    }
  );

  const completeHabitMutation = useMutation<any, Error, string>( // Returns any, Error, accepts habitId (string)
    (habitId: string) => api.post(`/habits/${habitId}/complete`),
    {
      onSuccess: (response) => {
        Toast.show({
          type: 'success',
          text1: 'Habit Completed!',
          text2: `+${response?.data?.xpEarned || 10} XP`, // Adjust based on actual API response
        });
        // Invalidate and refetch habits data to update the UI
        queryClient.invalidateQueries(["habits"]);
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data?.message || 'Could not complete habit.',
        });
      },
    }
  );

  // TODO: Add mutation for claiming daily reward if `hasClaimableReward` is true

  const hasClaimableReward = data?.dailyCompleted && !data?.rewardClaimed;

  return {
    habits: data?.habits || [],
    streak: data?.streak || 0,
    dailyCompleted: data?.dailyCompleted || false,
    rewardClaimed: data?.rewardClaimed || false,
    hasClaimableReward: hasClaimableReward || false,
    isLoading,
    refetch,
    completeHabit: completeHabitMutation.mutate,
    isCompletingHabit: completeHabitMutation.isLoading,
  };
}
