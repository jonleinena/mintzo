import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuthStore } from "@/stores/authStore";

function SettingsRow({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-black/10"
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={20} color="#64748B" />
        <Text className="text-base font-medium">{label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && <Text className="text-sm text-slate-500">{value}</Text>}
        {onPress && <Ionicons name="chevron-forward" size={16} color="#94A3B8" />}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { targetExamLevel, targetExamDate } = useSettingsStore();
  const { user, isAuthenticated } = useAuthStore();

  const examDateFormatted = targetExamDate
    ? new Date(targetExamDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not set";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-black mt-4 mb-6">Profile</Text>

        {/* User Card */}
        <View
          className="bg-surface-indigo border-2 border-black rounded-lg p-5 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-4">
            <View className="bg-white border-2 border-black rounded-full w-14 h-14 items-center justify-center">
              <Ionicons name="person" size={28} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black">
                {user?.displayName || "Guest User"}
              </Text>
              <Text className="text-sm text-slate-600">
                {user?.email || "Sign in to save progress"}
              </Text>
            </View>
          </View>
          {!isAuthenticated && (
            <Pressable
              onPress={() => router.push("/(auth)/login")}
              className="bg-brand-violet border-2 border-black rounded-lg py-3 mt-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 3,
              }}
            >
              <Text className="text-white font-bold text-center">
                Sign In
              </Text>
            </Pressable>
          )}
        </View>

        {/* Exam Settings */}
        <View
          className="bg-white border-2 border-black rounded-lg px-4 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-base font-bold pt-4 pb-2">Exam Settings</Text>
          <SettingsRow
            label="Target exam"
            value={targetExamLevel}
            icon="school"
            onPress={() => router.push("/(onboarding)/select-level")}
          />
          <SettingsRow
            label="Exam date"
            value={examDateFormatted}
            icon="calendar"
            onPress={() => router.push("/(onboarding)/set-exam-date")}
          />
          <SettingsRow
            label="Daily goal"
            value="45 min"
            icon="time"
            onPress={() => {}}
          />
        </View>

        {/* App Settings */}
        <View
          className="bg-white border-2 border-black rounded-lg px-4 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-base font-bold pt-4 pb-2">App</Text>
          <SettingsRow label="Notifications" icon="notifications" onPress={() => {}} />
          <SettingsRow label="Subscription" icon="card" onPress={() => {}} />
          <SettingsRow label="About" icon="information-circle" onPress={() => {}} />
        </View>

        {/* Sign Out */}
        {isAuthenticated && (
          <Pressable
            onPress={() => Alert.alert("Sign Out", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", style: "destructive", onPress: () => {} },
            ])}
            className="border-2 border-red-400 rounded-lg py-3 mb-8"
          >
            <Text className="text-red-500 font-bold text-center">Sign Out</Text>
          </Pressable>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
