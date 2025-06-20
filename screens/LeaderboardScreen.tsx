import React, { useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { useLeaderboard } from "../hooks/useLeaderboard";

export default function LeaderboardScreen() {
  const [filter, setFilter] = useState<"week" | "month" | "all">("all");
  const { leaderboard, isLoading } = useLeaderboard(filter);

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {["week", "month", "all"].map(tf => (
          <Button key={tf} title={tf} onPress={() => setFilter(tf as any)} />
        ))}
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 12 }}>
            <Text>{item.name} (@{item.username})</Text>
            <Text>{item.xp} XP - Rank #{item.rank}</Text>
            {item.followsYou && !item.isFollowing && (
              <Text>👥 Follows you — Follow back</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
