import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications not granted!');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
  // TODO: Send this token to your backend:
  // try {
  //   await api.post('/users/me/push-token', { token: tokenData.data });
  // } catch (e) { console.error("Failed to send push token to server", e); }
}

interface ScheduleOptions {
  trigger: Notifications.NotificationTriggerInput;
  identifier?: string; // For cancelling specific notifications
}

// Updated function to handle more complex triggers and cancellation
export async function scheduleLocalNotification(
  title: string,
  body: string,
  options?: ScheduleOptions
) {
  // Special handling for cancellation
  if (title === 'cancelAll' && options?.identifier) {
    console.log(`Cancelling notification with identifier: ${options.identifier}`);
    return Notifications.cancelScheduledNotificationAsync(options.identifier);
  } else if (title === 'cancelAll') {
    console.log("Cancelling all scheduled notifications.");
    return Notifications.cancelAllScheduledNotificationsAsync();
  }

  const defaultTrigger: Notifications.NotificationTriggerInput = { seconds: 1 };

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: options?.identifier ? { notificationId: options.identifier } : undefined // Attach identifier to data if provided
    },
    trigger: options?.trigger || defaultTrigger,
    identifier: options?.identifier, // Pass identifier if provided
  });
}

// Helper to create a daily trigger for a specific time (e.g., 9 PM)
export function createDailyTrigger(hour: number, minute: number): Notifications.DailyTriggerInput {
  return {
    hour,
    minute,
    repeats: true,
  };
}

// Example of how to use for streak reminder (could be called from app/habits/index.tsx)
export async function scheduleDailyStreakReminder() {
  const STREAK_REMINDER_ID = "streak-reminder";
  // First, cancel any existing streak reminder to avoid duplicates if app restarts etc.
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID);

  // Then, schedule the new one
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Keep Your Streak Alive!",
        body: "Don't forget to complete a habit today to maintain your awesome streak!",
        data: { path: '/habits' } // Example deep link data
      },
      trigger: createDailyTrigger(21, 0), // 9 PM daily
      identifier: STREAK_REMINDER_ID,
    });
    console.log("Daily streak reminder scheduled for 9 PM with ID:", STREAK_REMINDER_ID);
  } catch (e) {
    console.error("Failed to schedule daily streak reminder:", e);
  }
}
