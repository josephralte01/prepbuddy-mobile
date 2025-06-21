import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Toast from 'react-native-toast-message';

export interface ChapterListItem { // Exporting for use in screen
  _id: string;
  title: string;
  isCompleted?: boolean;
  // Add other relevant fields
}

const fetchChapters = async (subjectId: string): Promise<ChapterListItem[]> => {
  // Assuming an endpoint like /subjects/:subjectId/chapters or /chapters?subjectId=:subjectId
  // For now, using the previous one from the component
  const response = await api.get<ChapterListItem[]>(`/chapters/subject/${subjectId}`);
  return response.data;
};

export function useChapterList(subjectId: string | undefined | null) {
  const {
    data: chapters,
    isLoading,
    isError,
    error,
    refetch
} = useQuery<ChapterListItem[], Error>(
    ['chapters', subjectId], // Query key includes subjectId
    () => fetchChapters(subjectId as string), // Type assertion as it's enabled only if subjectId is present
    {
      enabled: !!subjectId, // Only run query if subjectId is available
      staleTime: 1000 * 60 * 2, // 2 minutes
      onError: (err: any) => {
        Toast.show({
            type: 'error',
            text1: 'Error Fetching Chapters',
            text2: err.message || 'Could not load the list of chapters.'
        });
      }
    }
  );

  return { chapters: chapters || [], isLoading, isError, error, refetch };
}
