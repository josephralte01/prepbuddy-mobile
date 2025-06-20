import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useDoubtSolver } from "../hooks/useDoubtSolver";

export default function DoubtSolverScreen() {
  const { doubts, askDoubt } = useDoubtSolver();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = async () => {
    const res = await askDoubt({ subject, topic, question });
    setSubject(""); setTopic(""); setQuestion("");
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} />
      <TextInput placeholder="Topic" value={topic} onChangeText={setTopic} />
      <TextInput placeholder="Your Doubt" value={question} onChangeText={setQuestion} multiline />

      <Button title="Ask" onPress={handleSubmit} />

      <FlatList
        data={doubts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text>Q: {item.question}</Text>
            <Text>A: {item.aiAnswer}</Text>
          </View>
        )}
      />
    </View>
  );
}
