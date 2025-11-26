import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "../../src/store/useThemeStore";

export default function TabsLayout() {
  const darkMode = useThemeStore((s) => s.darkMode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
          borderTopColor: darkMode ? "#333" : "#ddd",
        },
        tabBarActiveTintColor: darkMode ? "#4da6ff" : "#0066ff",
        tabBarInactiveTintColor: darkMode ? "#999" : "#444",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, size }) => (
            <Feather name="star" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
