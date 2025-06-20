import { useQuery } from "react-query";
import axios from "axios";

export function useLeaderboard(timeframe: "week" | "month" | "all" = "all") {
  const { data, isLoading } = useQuery(["leaderboard", timeframe], async () => {
    const res = await axios.get(`/api/leaderboard?timeframe=${timeframe}`);
    return res.data;
  });

  return { leaderboard: data || [], isLoading };
}
