import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"; // Added TouchableOpacity, ActivityIndicator
import { useDoubtSolver } from "@/hooks/doubt-solver/useDoubtSolver";

export default function DoubtSolverScreen() {
  const {
    doubts,
    isLoadingDoubts,
    refetchDoubts,
    askDoubt,
    isAskingDoubt
  } = useDoubtSolver();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = async () => {
    if (isAskingDoubt || !question.trim() || !subject.trim() || !topic.trim()) return;
    try {
      await askDoubt({ subject, topic, question });
      // onSuccess in the hook will show Toast and invalidate queries.
      // Clear form only on successful submission (or let hook handle it if it returns success status)
      setSubject("");
      setTopic("");
      setQuestion("");
    } catch (error) {
      // onError in the hook will show Toast.
      console.error("Error asking doubt (screen):", error);
    }
  };

  // Initial loading for previous doubts
  if (isLoadingDoubts && doubts.length === 0) {
    return (
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <ActivityIndicator size="large"/>
        </View>
    )
  }

  return (
    <View className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">🤔 Ask a Doubt</Text>
      <TextInput
        placeholder="Subject (e.g., Physics)"
        value={subject}
        onChangeText={setSubject}
        className="border border-gray-300 dark:border-gray-700 p-3 mb-3 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <TextInput
        placeholder="Topic (e.g., Kinematics)"
        value={topic}
        onChangeText={setTopic}
        className="border border-gray-300 dark:border-gray-700 p-3 mb-3 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <TextInput
        placeholder="Your Doubt..."
        value={question}
        onChangeText={setQuestion}
        multiline
        numberOfLines={4}
        className="border border-gray-300 dark:border-gray-700 p-3 mb-4 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 h-32"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isAskingDoubt || !subject.trim() || !topic.trim() || !question.trim()}
        className={`py-3 px-4 rounded-lg ${isAskingDoubt || !subject.trim() || !topic.trim() || !question.trim() ? 'bg-gray-400 dark:bg-gray-600' : 'bg-blue-600 dark:bg-blue-700'} items-center`}
      >
        {isAskingDoubt ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Ask Doubt</Text>}
      </TouchableOpacity>

      <FlatList
        data={doubts}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={<Text className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">Previous Doubts:</Text>}
        renderItem={({ item }) => (
          <View className="mt-2.5 border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <Text className="font-semibold text-gray-800 dark:text-gray-200">Q: {item.question}</Text>
            <Text className="text-gray-700 dark:text-gray-300 mt-1">A: {item.aiAnswer || 'AI is thinking...'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 dark:text-gray-400 mt-4">No previous doubts found.</Text>}
        className="mt-4"
        refreshing={isLoadingDoubts} // For pull to refresh
        onRefresh={refetchDoubts} // For pull to refresh
      />
    </View>
  );
}
