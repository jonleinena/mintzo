import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ExamPart } from "@/types/exam";

const PARTS_INFO: Record<
  ExamPart,
  { title: string; subtitle: string; duration: string; icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  part1: {
    title: "Part 1 - Interview",
    subtitle: "Answer personal questions about your life and interests",
    duration: "2 min",
    icon: "chatbubble",
    color: "bg-surface-cream",
  },
  part2: {
    title: "Part 2 - Long Turn",
    subtitle: "Compare photos and answer a follow-up question",
    duration: "4 min",
    icon: "images",
    color: "bg-surface-mint",
  },
  part3: {
    title: "Part 3 - Collaborative Task",
    subtitle: "Discuss options and reach a decision with the examiner",
    duration: "3 min",
    icon: "people",
    color: "bg-surface-indigo",
  },
  part4: {
    title: "Part 4 - Discussion",
    subtitle: "Extended discussion on topics from Part 3",
    duration: "4 min",
    icon: "chatbubbles",
    color: "bg-surface-cream",
  },
};

function PartCard({
  part,
  level,
}: {
  part: ExamPart;
  level: string;
}) {
  const router = useRouter();
  const info = PARTS_INFO[part];

  return (
    <Pressable
      onPress={() => router.push(`/exam/${level}/${part}`)}
      className={`${info.color} border-2 border-black rounded-lg p-5`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="bg-white border-2 border-black rounded-full w-12 h-12 items-center justify-center">
          <Ionicons name={info.icon} size={22} color="#000" />
        </View>
        <View className="bg-white border-2 border-black rounded-full px-3 py-1">
          <Text className="text-xs font-bold">{info.duration}</Text>
        </View>
      </View>
      <Text className="text-lg font-black mt-3">{info.title}</Text>
      <Text className="text-sm text-slate-600 mt-1">{info.subtitle}</Text>
    </Pressable>
  );
}

export default function PracticeScreen() {
  const { targetExamLevel } = useSettingsStore();
  const router = useRouter();

  // C2 has 3 parts, B2/C1 have 4
  const parts: ExamPart[] =
    targetExamLevel === "C2"
      ? ["part1", "part2", "part3"]
      : ["part1", "part2", "part3", "part4"];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-black mt-4">Practice</Text>
        <Text className="text-sm text-slate-500 font-medium mb-6">
          {targetExamLevel} Speaking Exam
        </Text>

        {/* Full Exam Button */}
        <Pressable
          onPress={() => router.push(`/exam/${targetExamLevel}/part1`)}
          className="bg-brand-violet border-2 border-black rounded-lg p-5 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-lg font-black">
                Full Exam Simulation
              </Text>
              <Text className="text-violet-200 text-sm mt-1">
                All {parts.length} parts - ~14 minutes
              </Text>
            </View>
            <Ionicons name="play-circle" size={40} color="#FFF" />
          </View>
        </Pressable>

        {/* Individual Parts */}
        <Text className="text-xl font-black mb-3">Practice by Part</Text>
        <View className="gap-3 mb-8">
          {parts.map((part) => (
            <PartCard
              key={part}
              part={part}
              level={targetExamLevel}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
