import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import useHabits from "../hooks/useHabits";
import XPToast from "../components/XPToast";
import ConfettiEffect from "../components/ConfettiEffect";
import { scheduleLocalNotification } from "../lib/notifications";

export default function HabitsScreen() {
  const { habits, streak, dailyCompleted, hasClaimableReward, refetch } = useHabits();
  const [showToast, setShowToast] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const completeHabit = async (habitId: string) => {
    await fetch(`/api/habits/complete/${habitId}`, { method: "POST" });
    setEarnedXP(10);
    setShowToast(true);
    scheduleLocalNotification("🎉 XP Earned!", "You gained 10 XP for completing a habit.");
    refetch();
  };

  const claimReward = async () => {
    await fetch(`/api/habits/claim-reward`, { method: "POST" });
    setEarnedXP(25);
    setShowToast(true);
    setShowConfetti(true);
    scheduleLocalNotification("🏅 Reward Claimed!", "You claimed 25 bonus XP!");
    refetch();
  };

  useEffect(() => {
    const now = new Date();
    const ninePM = new Date();
    ninePM.setHours(21, 0, 0, 0);
    if (now > ninePM) ninePM.setDate(ninePM.getDate() + 1);
    const delay = (ninePM.getTime() - now.getTime()) / 1000;

    scheduleLocalNotification("🔥 Keep your streak!", "Complete a habit today to maintain your streak!").then((notif) => {
      console.log("Streak reminder set for 9PM");
    });
  }, []);

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">Your Habits</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mb-3">
            <Text>{item.name}</Text>
            <Button title="Complete" onPress={() => completeHabit(item._id)} />
          </View>
        )}
      />

      {hasClaimableReward && <Button title="Claim XP Reward" onPress={claimReward} />}
      <XPToast xp={earnedXP} visible={showToast} onComplete={() => setShowToast(false)} />
      <ConfettiEffect trigger={showConfetti} />
    </View>
  );
}
