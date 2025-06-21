import { Redirect } from 'expo-router';

export default function TabIndex() {
  // This screen will redirect to the 'learn' tab.
  // The <Tabs.Screen name="learn" ... /> in app/(tabs)/_layout.tsx
  // uses href="/learn" to navigate to the main learn screen at app/learn/index.tsx.
  return <Redirect href="/learn" />;
}
