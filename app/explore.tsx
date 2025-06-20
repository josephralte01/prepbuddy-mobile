import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '@/lib/hooks/useUser';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ExploreScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [structure, setStructure] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('');

  useEffect(() => {
    axios.get('/api/exams').then((res) => setExams(res.data));
  }, []);

  const loadStructure = async (examId: string) => {
    setSelectedExamId(examId);
    const res = await axios.get(`/api/exams/${examId}/structure`);
    setStructure(res.data);
  };

  return (
    <ProtectedRoute>
      <ScrollView className="p-4">
        <Text className="text-xl font-bold mb-4">Explore Exams</Text>

        <View className="flex flex-row flex-wrap gap-3 mb-6">
          {exams.map((exam) => (
            <Pressable
              key={exam._id}
              onPress={() => loadStructure(exam._id)}
              className={`px-4 py-2 rounded-full border ${
                exam._id === selectedExamId
                  ? 'bg-black text-white'
                  : 'bg-white'
              }`}
            >
              <Text
                className={`font-medium ${
                  exam._id === selectedExamId ? 'text-white' : 'text-black'
                }`}
              >
                {exam.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {structure && (
          <View className="space-y-4">
            {structure.subjects.map((subject) => (
              <View key={subject._id}>
                <Text className="text-lg font-semibold mb-2">
                  {subject.name}
                </Text>
                <View className="space-y-2 ml-4">
                  {subject.chapters.map((chapter) => (
                    <Pressable
                      key={chapter._id}
                      onPress={() =>
                        router.push(`/material/${chapter._id}`)
                      }
                      className="p-3 bg-gray-100 rounded-lg"
                    >
                      <Text className="text-base">{chapter.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}
