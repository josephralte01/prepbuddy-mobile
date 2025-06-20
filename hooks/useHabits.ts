import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useHabits() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await api.get("/habits/me");
      return res.data;
    },
  });

  const hasClaimableReward = data?.dailyCompleted && !data?.rewardClaimed;

  return {
    habits: data?.habits || [],
    streak: data?.streak || 0,
    dailyCompleted: data?.dailyCompleted || false,
    rewardClaimed: data?.rewardClaimed || false,
    hasClaimableReward,
    isLoading,
    refetch,
  };
}
