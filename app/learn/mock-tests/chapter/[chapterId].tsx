// === app/learn/mock-tests/chapter/[chapterId].tsx ===
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
// import { useAppStatus } from '@/lib/useAppStatus'; // Replaced with local state
import Toast from 'react-native-toast-message';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer?: string; // Only available after submission typically
}

interface MockTestResultParams {
    score: string;
    xp: string;
    streak?: string; // Optional
    totalQuestions: string;
    chapterId: string; // Pass chapterId to result screen
}

export default function MockTestScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(600);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitError, setSubmitError] = useState<string | null>(null); // Not used, errors shown via Toast

  useEffect(() => {
    if (!chapterId) {
        Toast.show({type: 'error', text1: 'Error', text2: 'Chapter ID is missing.'});
        setIsLoadingQuestions(false); // Stop loading as there's nothing to load
        return;
    }
    setFetchError(null);
    setIsLoadingQuestions(true);
    api
      .post(`/mock-test/start`, { chapterId })
      .then((res) => {
        if (res.data && res.data.length > 0) {
            setQuestions(res.data);
        } else {
            setQuestions([]);
            Toast.show({type: 'info', text1: 'No Questions', text2: 'No questions found for this mock test.'});
        }
      })
      .catch((err) => {
        console.error("Failed to load mock test:", err);
        const errorMsg = err.response?.data?.message || 'Failed to load mock test. Please try again.';
        setFetchError(errorMsg);
        Toast.show({ type: 'error', text1: 'Error Loading Test', text2: errorMsg });
      })
      .finally(() => setIsLoadingQuestions(false));
  }, [chapterId]);

  useEffect(() => {
    if (timer <= 0) {
        handleSubmit(true); // Auto-submit when timer ends
        return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (option: string) => {
    if (questions.length === 0) return;
    setAnswers((prev) => ({ ...prev, [questions[currentQuestionIndex]._id]: option }));
  };

  const handleSubmit = async (autoSubmitted = false) => {
    if (!autoSubmitted) {
        Alert.alert('Submit Test', 'Are you sure you want to submit your answers?', [
        { text: 'Cancel', style: 'cancel' },
        {
            text: 'Submit',
            style: 'destructive',
            onPress: () => proceedWithSubmission(),
        },
        ]);
    } else {
        Toast.show({type: 'info', text1: 'Time Up!', text2: 'Submitting your test automatically.'});
        proceedWithSubmission();
    }
  };

  const proceedWithSubmission = async () => {
    setIsSubmitting(true);
    // setSubmitError(null); // Clear previous submit error
    try {
      const res = await api.post(`/mock-test/submit`, {
        chapterId: chapterId,
        answers,
      });

      const params: MockTestResultParams = {
        score: (res.data.score || 0).toString(),
        xp: (res.data.xpEarned || res.data.xp || 0).toString(),
        streak: (res.data.streak || 0).toString(),
        totalQuestions: (questions.length || 0).toString(),
        chapterId: chapterId as string,
      };

      router.replace({
        pathname: '/learn/mock-tests/result',
        params: params,
      });
    } catch (err: any) {
      console.error("Submission failed:", err);
      const errorMsg = err.response?.data?.message || 'Could not submit your test.';
      // setSubmitError(errorMsg);
      Toast.show({ type: 'error', text1: 'Submission Failed', text2: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle loading state for questions
  if (isLoadingQuestions) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{title: "Loading Test..."}} />
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
          <ActivityIndicator size="large" />
        </View>
      </ProtectedRoute>
    );
  }

  // Handle error state for fetching questions
  if (fetchError && questions.length === 0) {
    return (
      <ProtectedRoute>
        <Stack.Screen options={{title: "Error"}} />
        {/* Using ErrorFallback component */}
        <ErrorFallback
            fullScreen
            title="Failed to Load Test"
            message={fetchError}
            onRetry={() => { /* Implement refetch logic if useAppStatus is removed or use React Query's refetch */
                // For now, just a back button or manual refresh.
                // If this were a RQ hook: query.refetch()
                // Manually:
                setIsLoadingQuestions(true);
                setFetchError(null);
                 api.post(`/mock-test/start`, { chapterId })
                    .then((res) => setQuestions(res.data || []))
                    .catch((err) => {
                        const errorMsg = err.response?.data?.message || 'Failed to load mock test. Please try again.';
                        setFetchError(errorMsg);
                        Toast.show({ type: 'error', text1: 'Error Loading Test', text2: errorMsg });
                    })
                    .finally(() => setIsLoadingQuestions(false));
            }}
        />
      </ProtectedRoute>
    );
  }

  // Handle case where no questions are available but no error occurred
  if (questions.length === 0) {
     return (
      <ProtectedRoute>
        <Stack.Screen options={{title: "No Questions"}} />
        <View className="flex-1 justify-center items-center p-4 bg-gray-50 dark:bg-gray-900">
          <Text className="text-gray-700 dark:text-gray-300 text-center text-lg">No questions available for this mock test.</Text>
           <Pressable onPress={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg">
            <Text className="text-white">Go Back</Text>
          </Pressable>
        </View>
      </ProtectedRoute>
    );
  }


  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ProtectedRoute>
      <Stack.Screen options={{title: `Question ${currentQuestionIndex + 1}/${questions.length}`}} />
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        <Text className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">⏱️ {formatTime(timer)}</Text>
        <View className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{`Q${currentQuestionIndex + 1}. ${currentQuestion.question}`}</Text>
        </View>

        {currentQuestion.options.map((opt, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleAnswer(opt)}
            className={`p-4 my-2 rounded-xl border ${
              answers[currentQuestion._id] === opt
                ? 'bg-blue-600 dark:bg-blue-700 border-blue-700 dark:border-blue-800'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
          >
            <Text className={`${
              answers[currentQuestion._id] === opt ? 'text-white' : 'text-gray-800 dark:text-gray-200'
            } text-base`}>
              {opt}
            </Text>
          </Pressable>
        ))}

        <View className="flex-row justify-between mt-8 items-center">
          <Pressable
            onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={`px-5 py-3 rounded-lg ${currentQuestionIndex === 0 ? 'bg-gray-300 dark:bg-gray-600 opacity-50' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            <Text className="text-gray-800 dark:text-gray-200 font-semibold">⬅️ Prev</Text>
          </Pressable>

          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {currentQuestionIndex + 1} / {questions.length}
          </Text>

          {currentQuestionIndex < questions.length - 1 ? (
            <Pressable
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="px-5 py-3 bg-blue-600 dark:bg-blue-700 rounded-lg"
            >
              <Text className="text-white font-semibold">Next ➡️</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => handleSubmit(false)}
              className="px-5 py-3 bg-green-600 dark:bg-green-700 rounded-lg"
            >
              <Text className="text-white font-semibold">✅ Submit</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}
