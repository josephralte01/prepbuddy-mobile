import React, { useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import ConfettiEffect from "../components/ConfettiEffect";

const mockBadges = [
  { id: "1", name: "First XP", claimable: true },
  { id: "2", name: "Level 5", claimable: false },
];

export default function BadgesScreen() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [badges, setBadges] = useState(mockBadges);

  const claimBadge = async (id: string) => {
    await fetch(`/api/badges/claim/${id}`, { method: "POST" });
    setShowConfetti(true);
    setBadges((prev) => prev.map(b => b.id === id ? { ...b, claimable: false } : b));
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">Badges</Text>
      <FlatList
        data={badges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3">
            <Text>{item.name}</Text>
            {item.claimable && <Button title="Claim" onPress={() => claimBadge(item.id)} />}
          </View>
        )}
      />
      <ConfettiEffect trigger={showConfetti} />
    </View>
  );
}
