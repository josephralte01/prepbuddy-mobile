import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/user/useUser';
import ProtectedRoute from '@/components/ProtectedRoute';

// TODO: Define interfaces for Exam, ExamStructure, Subject, Chapter if not already available globally
interface Exam {
  _id: string;
  name: string;
}
interface Chapter {
    _id: string;
    name: string;
}
interface Subject {
    _id: string;
    name: string;
    chapters: Chapter[];
}
interface ExamStructure {
    subjects: Subject[];
}


export default function LearnIndexScreen() { // Renamed from ExploreScreen
  const { user } = useUser(); // user may not be strictly necessary here if content is public
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [structure, setStructure] = useState<ExamStructure | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingStructure, setLoadingStructure] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const res = await api.get('/exams');
        setExams(res.data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
        // TODO: show toast error
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  const loadStructure = async (examId: string) => {
    if (selectedExamId === examId && structure) return;

    setSelectedExamId(examId);
    setLoadingStructure(true);
    setStructure(null);
    try {
      const res = await api.get(`/exams/${examId}/structure`);
      setStructure(res.data);
    } catch (error) {
      console.error("Failed to load exam structure:", error);
      // TODO: show toast error
    } finally {
      setLoadingStructure(false);
    }
  };

  return (
    <ProtectedRoute>
      <ScrollView className="p-4 bg-gray-50 dark:bg-gray-900">
        <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Explore Learning Material</Text>

        {loadingExams ? (
          <ActivityIndicator size="large" className="my-4" />
        ) : (
          <View className="flex flex-row flex-wrap gap-3 mb-6 justify-center">
            {exams.map((exam) => (
              <Pressable
                key={exam._id}
                onPress={() => loadStructure(exam._id)}
                className={`px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 ${
                  exam._id === selectedExamId
                    ? 'bg-blue-600 dark:bg-blue-700'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <Text
                  className={`font-medium ${
                    exam._id === selectedExamId ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {exam.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {loadingStructure && <ActivityIndicator size="large" className="my-4" />}

        {!loadingStructure && structure && (
          <View className="space-y-4">
            {structure.subjects.map((subject) => (
              <View key={subject._id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <Text className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {subject.name}
                </Text>
                <View className="space-y-2">
                  {subject.chapters.map((chapter) => (
                    <Pressable
                      key={chapter._id}
                      onPress={() =>
                        router.push(`/learn/material/${chapter._id}`) // Updated path
                      }
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg active:opacity-70"
                    >
                      <Text className="text-base text-gray-800 dark:text-gray-200">{chapter.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
         {!loadingStructure && selectedExamId && !structure && (
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No structure found for the selected exam or failed to load.
          </Text>
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}
