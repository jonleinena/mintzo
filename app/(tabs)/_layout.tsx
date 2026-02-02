import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function TabIcon({
  name,
  focused,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  label: string;
}) {
  return (
    <View className="items-center justify-center pt-1 w-[72px]">
      <Ionicons
        name={name}
        size={24}
        color={focused ? "#7C3AED" : "#64748B"}
      />
      <Text
        className={`text-[10px] mt-0.5 ${
          focused ? "text-brand-violet font-bold" : "text-slate-500"
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#F8F8F8",
          borderWidth: 2,
          borderColor: "#000000",
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          marginHorizontal: 16,
          marginBottom: 12,
          borderRadius: 24,
          position: "absolute",
          left: 0,
          right: 0,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="mic" focused={focused} label="Practice" />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="stats-chart" focused={focused} label="Progress" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
