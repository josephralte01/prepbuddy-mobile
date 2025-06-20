import { Tabs } from "expo-router";
import CustomTabBar from "../components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="Habits" options={{ title: "Habits", tabBarBadge: true }} />
      <Tabs.Screen name="Badges" options={{ title: "Badges" }} />
      <Tabs.Screen name="DoubtSolver" options={{ title: "DoubtSolver" }} />
      <Tabs.Screen name="Leaderboard" options={{ title: "Leaderboard" }} />
    </Tabs>
  );
}
