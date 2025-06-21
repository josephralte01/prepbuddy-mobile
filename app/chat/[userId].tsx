// === File: prepbuddy-mobile/app/chat/[userId].tsx ===
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/hooks/user/useUser';
import { useChatSocket } from '@/hooks/chat/useChatSocket'; // Updated path
import { api } from '@/lib/api';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams();
  const { user } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const { sendMessage } = useChatSocket((newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await api.get(`/api/chat/history/${userId}`);
      setMessages(res.data);
    };
    if (userId) fetchHistory();
  }, [userId]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = {
      sender: user?._id,
      recipient: userId,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    sendMessage(userId as string, input.trim());
    setInput('');
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={messages}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View
            className={`my-1 px-4 py-2 rounded-lg max-w-[80%] ${
              item.sender === user?._id ? 'self-end bg-blue-500' : 'self-start bg-gray-200'
            }`}
          >
            <Text className={`text-sm ${item.sender === user?._id ? 'text-white' : 'text-black'}`}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      <View className="flex-row items-center p-3 border-t">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <Pressable
          onPress={handleSend}
          className="bg-blue-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
