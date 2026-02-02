import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";

function StatRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b-2 border-black/10">
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={20} color="#64748B" />
        <Text className="text-base font-medium">{label}</Text>
      </View>
      <Text className="text-base font-black">{value}</Text>
    </View>
  );
}

function ContributionsPlaceholder() {
  // Placeholder grid - will be replaced with real ContributionsGraph component
  const weeks = 12;
  const days = 7;
  return (
    <View className="bg-white border-2 border-black rounded-lg p-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 }}>
      <Text className="text-base font-bold mb-3">Practice Activity</Text>
      <View className="flex-row gap-[3px]">
        {Array.from({ length: weeks }).map((_, w) => (
          <View key={w} className="gap-[3px]">
            {Array.from({ length: days }).map((_, d) => (
              <View
                key={d}
                className="w-[14px] h-[14px] rounded-[3px] bg-surface-secondary border border-black/10"
              />
            ))}
          </View>
        ))}
      </View>
      <Text className="text-xs text-slate-400 mt-3">
        Start practicing to fill in your activity graph
      </Text>
    </View>
  );
}

function ScoreOverview() {
  const criteria = [
    { label: "Grammar & Vocabulary", score: 0 },
    { label: "Discourse Management", score: 0 },
    { label: "Pronunciation", score: 0 },
    { label: "Interactive Communication", score: 0 },
    { label: "Global Achievement", score: 0 },
  ];

  return (
    <View className="bg-white border-2 border-black rounded-lg p-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 }}>
      <Text className="text-base font-bold mb-3">Score Overview</Text>
      {criteria.map((c) => (
        <View key={c.label} className="mb-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm font-medium">{c.label}</Text>
            <Text className="text-sm font-bold">{c.score}/5</Text>
          </View>
          <View className="bg-surface-secondary border border-black/20 rounded-full h-3 overflow-hidden">
            <View
              className="bg-brand-violet h-full rounded-full"
              style={{ width: `${(c.score / 5) * 100}%` }}
            />
          </View>
        </View>
      ))}
      <Text className="text-xs text-slate-400 mt-1">
        Complete an exam to see your scores
      </Text>
    </View>
  );
}

export default function ProgressScreen() {
  const { targetExamLevel } = useSettingsStore();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-black mt-4">Progress</Text>
        <Text className="text-sm text-slate-500 font-medium mb-6">
          {targetExamLevel} Speaking
        </Text>

        {/* Contributions Graph */}
        <View className="mb-6">
          <ContributionsPlaceholder />
        </View>

        {/* Stats */}
        <View className="bg-white border-2 border-black rounded-lg p-4 mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 }}>
          <Text className="text-base font-bold mb-1">Statistics</Text>
          <StatRow label="Total sessions" value="0" icon="mic" />
          <StatRow label="Practice time" value="0 min" icon="time" />
          <StatRow label="Current streak" value="0 days" icon="flame" />
          <StatRow label="Longest streak" value="0 days" icon="trophy" />
          <StatRow label="Average score" value="--" icon="star" />
        </View>

        {/* Score Overview */}
        <View className="mb-8">
          <ScoreOverview />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
