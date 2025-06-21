import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Toast from 'react-native-toast-message';

export interface ExamListItem {
  _id: string;
  name: string;
  description: string;
  // Add any other relevant fields from the API response
}

const fetchExams = async (): Promise<ExamListItem[]> => {
  const response = await api.get<ExamListItem[]>('/exams');
  return response.data;
};

export function useExamList() {
  const {
    data: exams,
    isLoading,
    isError,
    error,
    refetch // Expose refetch if manual refresh is needed
} = useQuery<ExamListItem[], Error>(
    ['exams'], // Query key
    fetchExams,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      onError: (err: any) => {
        Toast.show({
            type: 'error',
            text1: 'Error Fetching Exams',
            text2: err.message || 'Could not load the list of exams.'
        });
      }
    }
  );

  return { exams: exams || [], isLoading, isError, error, refetch };
}
