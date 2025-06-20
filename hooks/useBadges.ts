import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

export function useBadges() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("badges", async () => {
    const res = await axios.get("/api/badges");
    return res.data;
  });

  const { mutate: claimBadge } = useMutation(
    (badgeId: string) => axios.post("/api/badges/claim", { badgeId }),
    {
      onSuccess: () => queryClient.invalidateQueries("badges"),
    }
  );

  return { badges: data || [], isLoading, claimBadge };
}
