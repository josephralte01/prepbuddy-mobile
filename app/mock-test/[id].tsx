// === app/mock-test/[id].tsx ===
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAppStatus } from '@/lib/useAppStatus';
import Toast from 'react-native-toast-message';
import ProtectedRoute from '@/components/ProtectedRoute';

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
};

export default function MockTestScreen() {
  const { id } = useLocalSearchParams(); // chapterId
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(600); // 10 mins

  const { loading, error, startLoading, stopLoading, raiseError } = useAppStatus();

  useEffect(() => {
    startLoading();
    api
      .post(`/api/mock-test/start`, { chapterId: id })
      .then((res) => setQuestions(res.data))
      .catch(() => raiseError('Failed to load mock test'))
      .finally(() => stopLoading());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [questions[current]._id]: option }));
  };

  const handleSubmit = async () => {
    Alert.alert('Submit Test', 'Are you sure you want to submit?', [
      { text: 'Cancel' },
      {
        text: 'Submit',
        onPress: async () => {
          startLoading();
          try {
            const res = await api.post(`/api/mock-test/submit`, {
              chapterId: id,
              answers,
            });

            router.replace({
              pathname: '/mock-test/result',
              params: {
                score: res.data.score.toString(),
                xp: res.data.xp.toString(),
                streak: res.data.streak.toString(),
              },
            });
          } catch (err) {
            raiseError('Submission failed');
            Toast.show({ type: 'error', text1: 'Failed to submit' });
          } finally {
            stopLoading();
          }
        },
      },
    ]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !questions.length) return <ActivityIndicator className="mt-20" />;
  if (error) return <Text className="text-red-500 mt-10 text-center">{error}</Text>;

  const q = questions[current];

  return (
    <ProtectedRoute>
      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-xl font-bold mb-2 text-center">⏱️ {formatTime(timer)}</Text>
        <Text className="text-lg font-semibold mb-2">{`Q${current + 1}. ${q.question}`}</Text>

        {q.options.map((opt, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleAnswer(opt)}
            className={`p-3 my-2 rounded-xl ${
              answers[q._id] === opt ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <Text className={answers[q._id] === opt ? 'text-white' : 'text-gray-800'}>
              {opt}
            </Text>
          </Pressable>
        ))}

        <View className="flex-row justify-between mt-6">
          {current > 0 && (
            <Pressable
              onPress={() => setCurrent(current - 1)}
              className="px-4 py-2 bg-gray-300 rounded-full"
            >
              <Text>⬅️ Prev</Text>
            </Pressable>
          )}
          {current < questions.length - 1 ? (
            <Pressable
              onPress={() => setCurrent(current + 1)}
              className="px-4 py-2 bg-blue-500 rounded-full"
            >
              <Text className="text-white">Next ➡️</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSubmit}
              className="px-4 py-2 bg-green-600 rounded-full"
            >
              <Text className="text-white">✅ Submit</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}
