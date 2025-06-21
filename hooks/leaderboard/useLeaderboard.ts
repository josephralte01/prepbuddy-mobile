import { useQuery } from "@tanstack/react-query"; // Ensure this is the correct import
import { api } from "@/lib/api"; // Use centralized API
import Toast from "react-native-toast-message";

interface LeaderboardUser {
  _id: string;
  name: string;
  username: string;
  xp: number;
  rank: number;
  // Add other fields like avatar, followsYou, isFollowing if returned by API
}

export function useLeaderboard(timeframe: "week" | "month" | "all" = "all") {
  const { data, isLoading, isError } = useQuery<LeaderboardUser[], Error>( // Added types
    ["leaderboard", timeframe],
    async () => {
      const res = await api.get(`/leaderboard?timeframe=${timeframe}`); // Removed /api prefix
      return res.data;
    },
    {
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Leaderboard Error',
          text2: error.message || 'Could not load leaderboard data.'
        })
      }
      // Consider staleTime or cacheTime if leaderboard data doesn't change too frequently
    }
  );

  return { leaderboard: data || [], isLoading, isError };
}
