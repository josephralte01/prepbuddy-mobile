import React, { useState, useEffect } from "react"; // Keep useEffect if needed for other things, not for data fetching
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import ConfettiEffect from "@/components/ConfettiEffect";
// api is now used in the hook
import { useBadges, Badge } from "@/hooks/badges/useBadges"; // Import the new hook and Badge interface
import { Stack } from "expo-router";

export default function BadgesScreen() {
  const {
    badges,
    isLoadingBadges,
    // refetchBadges, // For pull-to-refresh
    claimBadge,
    isClaimingBadge
  } = useBadges();

  const [showConfettiForBadgeId, setShowConfettiForBadgeId] = useState<string | null>(null);

  const handleClaimBadge = async (badgeId: string) => {
    try {
      await claimBadge(badgeId); // This will show toast on success/error from the hook
      // Trigger confetti specific to this badge
      setShowConfettiForBadgeId(badgeId);
      // Confetti for claimed badge will be shown via XPToast like mechanism or a short delay
      setTimeout(() => setShowConfettiForBadgeId(null), 3000); // Hide confetti after 3s
    } catch (error) {
      // Error is handled by the hook's Toast message
      console.error("Claiming badge failed (screen):", error);
    }
  };

  if (isLoadingBadges && badges.length === 0) { // Initial load
    return (
      <>
        <Stack.Screen options={{ title: "Loading Badges..."}} />
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  return (
    <>
    <Stack.Screen options={{ title: "Your Badges"}} />
    <View className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">🏆 Your Badges</Text>
      {badges.length === 0 && !isLoadingBadges ? (
        <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No badges earned or available yet. Keep up the good work!</Text>
      ) : (
        <FlatList
            data={badges}
            keyExtractor={(item) => item.id}
            // onRefresh={refetchBadges} // Optional: pull to refresh
            // refreshing={isLoadingBadges} // Optional: pull to refresh
            renderItem={({ item }) => {
            const currentBadgeIsClaiming = isClaimingBadge && claimBadge.variables === item.id;
            return (
                <View className="p-4 mb-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</Text>
                {item.description && <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">{item.description}</Text>}

                {item.claimed && (
                    <Text className="text-sm text-green-600 dark:text-green-400 mt-2 font-semibold">✓ Claimed</Text>
                )}

                {item.claimable && !item.claimed && (
                    <TouchableOpacity
                    onPress={() => handleClaimBadge(item.id)}
                    disabled={currentBadgeIsClaiming || isClaimingBadge} // Disable if this or any other badge is claiming
                    className={`py-2.5 px-4 rounded-lg mt-3 self-start ${currentBadgeIsClaiming || isClaimingBadge ? 'bg-gray-400 dark:bg-gray-600' : 'bg-yellow-500 dark:bg-yellow-600'}`}
                    >
                    {currentBadgeIsClaiming ? <ActivityIndicator color="#fff" size="small"/> :
                        <Text className="text-white font-semibold">
                        Claim Badge
                        </Text>
                    }
                    </TouchableOpacity>
                )}
                {!item.claimable && !item.claimed && (
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">Not yet earned</Text>
                )}
                {/* Individual confetti for just claimed badge */}
                {showConfettiForBadgeId === item.id && <ConfettiEffect trigger={true} />}
                </View>
            );
            }}
            ListEmptyComponent={!isLoadingBadges ? <Text className="text-center text-gray-500 dark:text-gray-400 mt-4">No badges available yet.</Text> : null}
        />
      )}
      {/* General confetti can be triggered by a global state if needed, for now individual is fine */}
    </View>
    </>
  );
}
