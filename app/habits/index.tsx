// === app/habits/index.tsx ===
import { useEffect } from 'react'; // Removed useState as it's handled by useHabits
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useUser } from '@/hooks/user/useUser';
import ProtectedRoute from '@/components/ProtectedRoute';
// Toast is now handled by the hook
import useHabits from '@/hooks/habits/useHabits';
import { scheduleLocalNotification, registerForPushNotificationsAsync } from '@/lib/notifications'; // Import notification functions
import { AppState, Platform } from 'react-native'; // For checking app state for notifications

export default function HabitsScreen() {
  const { user } = useUser();
  const {
    habits,
    isLoading,
    // refetch, // Can be used for pull-to-refresh
    completeHabit,
    isCompletingHabit,
    // streak, // Available if needed
    // dailyCompleted, // Available if needed
    // rewardClaimed, // Available if needed
    // hasClaimableReward, // Available if needed for a claim reward button
  } = useHabits();

  // The hook now manages loading state, data fetching, and completion logic.
  // Progress map might need to be reconstructed if backend doesn't provide completion status per habit directly in habits list.
  // For simplicity, assuming habits list from hook contains necessary completion status or can be derived.
  // If not, app/habits/index.tsx might still need to manage some local display state based on hook's data.

  // Example of how handleComplete would change:
  const handleComplete = (habitId: string) => {
    completeHabit(habitId); // This now calls the mutation from the hook
  };

  // useEffect for fetching is handled within useHabits hook triggered by queryKey/enabled status.
  // The hook is enabled by default when the component mounts.

import { useUser } from '@/hooks/user/useUser';
import ProtectedRoute from '@/components/ProtectedRoute';
// Toast is now handled by the hook
import useHabits from '@/hooks/habits/useHabits';
import { scheduleDailyStreakReminder, registerForPushNotificationsAsync } from '@/lib/notifications'; // Import notification functions
import { AppState, Platform } from 'react-native'; // For checking app state for notifications

export default function HabitsScreen() {
  const { user } = useUser();
  const {
    habits,
    isLoading,
    // refetch, // Can be used for pull-to-refresh
    completeHabit,
    isCompletingHabit,
    // streak, // Available if needed
    // dailyCompleted, // Available if needed
    // rewardClaimed, // Available if needed
    // hasClaimableReward, // Available if needed for a claim reward button
  } = useHabits();

  // The hook now manages loading state, data fetching, and completion logic.
  // Progress map might need to be reconstructed if backend doesn't provide completion status per habit directly in habits list.
  // For simplicity, assuming habits list from hook contains necessary completion status or can be derived.
  // If not, app/habits/index.tsx might still need to manage some local display state based on hook's data.

  // Example of how handleComplete would change:
  const handleComplete = (habitId: string) => {
    completeHabit(habitId); // This now calls the mutation from the hook
  };

  // useEffect for fetching is handled within useHabits hook triggered by queryKey/enabled status.
  // The hook is enabled by default when the component mounts.

  // Effect for scheduling daily streak reminder
  useEffect(() => {
    if (user) {
      // Request permissions and schedule daily reminder
      // This could also be done once at app startup or in a settings screen
      const setupNotifications = async () => {
        await registerForPushNotificationsAsync(); // Ensure permissions are requested
        await scheduleDailyStreakReminder();
      };
      setupNotifications();
    }
    // This effect should run when the user logs in or out.
    // If user logs out, existing notifications might persist unless explicitly cancelled.
    // The scheduleDailyStreakReminder itself cancels previous instances with the same ID.
  }, [user]);


  if (isLoading && habits.length === 0) { // Show loading indicator if loading and no habits yet (initial load)
    return (
      <ProtectedRoute>
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
          <ActivityIndicator size="large" />
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-6">
        <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">🧠 Habit Tracker</Text>
        {/* TODO: Add a claim reward button if hasClaimableReward is true */}
        {/* Example: {hasClaimableReward && <Button title="Claim Daily Reward!" onPress={handleClaimRewardMutation} />} */}

        {habits.length === 0 && !isLoading && ( // Use isLoading from hook
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">No habits set up yet. Add some habits to get started!</Text>
        )}
        {habits.map((habit: any) => { // Define type for habit from useHabits hook
          // Assuming 'completedToday' is a property of the habit object from the backend via useHabits
          // Or it needs to be derived based on 'lastCompletedDate' or similar from the habit object.
          // For now, let's assume a 'completedToday' boolean exists on the habit object.
          const completedToday = habit.completedToday || false; // Placeholder
          const currentHabitIsCompleting = isCompletingHabit && completeHabit.variables === habit._id;


          return (
            <View key={habit._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
              <Text className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">{habit.title}</Text>
              {habit.description && <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">{habit.description}</Text>}
              {habit.frequency && <Text className="text-sm text-gray-600 dark:text-gray-400">Frequency: {habit.frequency}</Text>}
              {/* Streak per habit might come from habit object itself, or global streak from useHabits hook */}
              <Text className="text-sm text-gray-600 dark:text-gray-400">Streak: {habit.streak || 0} days</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">XP: {habit.xpReward || 10}</Text>
              <Pressable
                className={`py-2.5 px-4 rounded-lg flex-row justify-center items-center h-11 ${
                  completedToday ? 'bg-green-500 dark:bg-green-600 opacity-70' : (currentHabitIsCompleting ? 'bg-gray-400 dark:bg-gray-500' : 'bg-blue-600 dark:bg-blue-700')
                }`}
                onPress={() => handleComplete(habit._id)}
                disabled={completedToday || currentHabitIsCompleting || isCompletingHabit} // Disable if this or any other habit is completing
              >
                {currentHabitIsCompleting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    {completedToday ? '✅ Completed' : 'Mark as Done'}
                  </Text>
                )}
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </ProtectedRoute>
  );
}
