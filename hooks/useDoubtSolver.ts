import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

export function useDoubtSolver() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("doubts", async () => {
    const res = await axios.get("/api/doubts");
    return res.data;
  });

  const { mutateAsync: askDoubt } = useMutation(
    (payload: { question: string; subject: string; topic: string }) =>
      axios.post("/api/doubts/ask", payload),
    {
      onSuccess: () => queryClient.invalidateQueries("doubts"),
    }
  );

  return { doubts: data || [], isLoading, askDoubt };
}
