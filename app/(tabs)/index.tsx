import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";

function DaysUntilExam({ dateString }: { dateString: string | null }) {
  if (!dateString) return null;
  const examDate = new Date(dateString);
  const now = new Date();
  const diff = Math.ceil(
    (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return null;
  return (
    <View className="bg-surface-cream border-2 border-black rounded-lg p-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 }}>
      <Text className="text-sm text-slate-500 font-medium">Exam countdown</Text>
      <Text className="text-4xl font-black mt-1">{diff}</Text>
      <Text className="text-sm text-slate-500">days to go</Text>
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
  color = "bg-white",
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}) {
  return (
    <View
      className={`${color} border-2 border-black rounded-lg p-4 flex-1`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      }}
    >
      <Ionicons name={icon} size={20} color="#64748B" />
      <Text className="text-2xl font-black mt-2">{value}</Text>
      <Text className="text-xs text-slate-500 font-medium">{label}</Text>
    </View>
  );
}

function QuickAction({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`${color} border-2 border-black rounded-lg p-4 flex-row items-center`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      }}
    >
      <View className="bg-white border-2 border-black rounded-full w-12 h-12 items-center justify-center mr-4">
        <Ionicons name={icon} size={24} color="#000" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold">{title}</Text>
        <Text className="text-sm text-slate-600">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#000" />
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { targetExamLevel, targetExamDate } = useSettingsStore();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View>
            <Text className="text-3xl font-black">Mintzo</Text>
            <Text className="text-sm text-slate-500 font-medium">
              {targetExamLevel} Speaking Practice
            </Text>
          </View>
          <View className="bg-surface-indigo border-2 border-black rounded-full w-10 h-10 items-center justify-center">
            <Ionicons name="flame" size={20} color="#7C3AED" />
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          <DaysUntilExam dateString={targetExamDate} />
          <View className="flex-1 gap-3">
            <StatCard
              label="Current streak"
              value="0"
              icon="flame"
              color="bg-surface-mint"
            />
            <StatCard
              label="Sessions"
              value="0"
              icon="mic"
              color="bg-surface-indigo"
            />
          </View>
        </View>

        {/* Today's Practice */}
        <Text className="text-xl font-black mb-3">Today's Practice</Text>
        <View className="bg-surface-secondary border-2 border-black rounded-lg p-4 mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 }}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold">0 / 45 min</Text>
            <Text className="text-sm text-slate-500">Daily goal</Text>
          </View>
          <View className="bg-white border-2 border-black rounded-full h-4 overflow-hidden">
            <View className="bg-brand-violet h-full rounded-full" style={{ width: "0%" }} />
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-xl font-black mb-3">Quick Start</Text>
        <View className="gap-3 mb-8">
          <QuickAction
            title="Full Exam"
            subtitle="Practice all 4 parts"
            icon="reader"
            color="bg-surface-cream"
            onPress={() => router.push(`/exam/${targetExamLevel}/part1`)}
          />
          <QuickAction
            title="Single Part"
            subtitle="Focus on one area"
            icon="mic"
            color="bg-surface-mint"
            onPress={() => router.push("/(tabs)/practice")}
          />
          <QuickAction
            title="Review Results"
            subtitle="See past performance"
            icon="bar-chart"
            color="bg-surface-indigo"
            onPress={() => router.push("/(tabs)/progress")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
