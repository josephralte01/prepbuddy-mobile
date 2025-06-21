import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Ensure this is the correct import
import { api } from "@/lib/api"; // Use centralized API
import Toast from "react-native-toast-message";

interface Doubt {
  _id: string;
  question: string;
  subject: string;
  topic: string;
  aiAnswer?: string;
  createdAt: string;
  // Add other relevant fields
}

interface AskDoubtPayload {
  question: string;
  subject: string;
  topic: string;
}

export function useDoubtSolver() {
  const queryClient = useQueryClient();

  const { data: doubts, isLoading: isLoadingDoubts, refetch: refetchDoubts } = useQuery<Doubt[], Error>( // Typed query
    ["doubts"], // Query key
    async () => {
      const res = await api.get("/doubts"); // Removed /api prefix
      return res.data;
    },
    {
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Could not fetch previous doubts.' });
      }
    }
  );

  const { mutateAsync: askDoubt, isLoading: isAskingDoubt } = useMutation<any, Error, AskDoubtPayload>( // Typed mutation
    async (payload) => {
      const res = await api.post("/doubts/ask", payload); // Removed /api prefix
      return res.data;
    },
    {
      onSuccess: (data) => { // data here is the response from POST /doubts/ask
        Toast.show({ type: 'success', text1: 'Doubt Submitted!', text2: 'The AI is working on your question.' });
        queryClient.invalidateQueries(["doubts"]); // Refetch the list of doubts
      },
      onError: (error: any) => {
        Toast.show({
            type: 'error',
            text1: 'Submission Failed',
            text2: error.response?.data?.message || 'Could not submit your doubt.'
        });
      },
    }
  );

  return {
    doubts: doubts || [],
    isLoadingDoubts,
    refetchDoubts,
    askDoubt,
    isAskingDoubt
  };
}
