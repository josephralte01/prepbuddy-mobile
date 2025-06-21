import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Ensure this is the correct import
import { api } from "@/lib/api"; // Use centralized API
import Toast from "react-native-toast-message";

export interface Badge { // Exporting for use in screen
  id: string; // Or _id depending on your backend
  name: string;
  description?: string;
  claimed: boolean;
  claimable: boolean;
  iconUrl?: string; // Optional
  // Add other relevant fields
}

export function useBadges() {
  const queryClient = useQueryClient();

  const {
    data: badges,
    isLoading: isLoadingBadges,
    refetch: refetchBadges
} = useQuery<Badge[], Error>( // Typed query
    ["badges"], // Query key
    async () => {
      const res = await api.get("/badges"); // Removed /api prefix
      return res.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes, badges might not change too often
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: 'Error Fetching Badges', text2: error.message || 'Could not load badges.' });
      }
    }
  );

  const {
    mutateAsync: claimBadge,
    isLoading: isClaimingBadge
} = useMutation<any, Error, string>( // Accepts badgeId (string)
    async (badgeId: string) => {
      const res = await api.post(`/badges/claim/${badgeId}`); // Updated endpoint, removed /api prefix
      return res.data;
    },
    {
      onSuccess: (data, badgeId) => { // data is response from POST
        Toast.show({ type: 'success', text1: 'Badge Claimed!', text2: data?.message || `You've successfully claimed the badge.` });
        queryClient.invalidateQueries(["badges"]); // Refetch the list of badges
        // Optionally, if claiming a badge gives XP or updates user profile:
        queryClient.invalidateQueries(["user"]);
      },
      onError: (error: any) => {
        Toast.show({
            type: 'error',
            text1: 'Claim Failed',
            text2: error.response?.data?.message || 'Could not claim the badge.'
        });
      },
    }
  );

  return {
    badges: badges || [],
    isLoadingBadges,
    refetchBadges,
    claimBadge,
    isClaimingBadge
  };
}
