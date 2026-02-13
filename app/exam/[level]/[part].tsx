import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ExamPart } from "@/types/exam";
import { useSubscriptionGate } from "@/hooks/useSubscriptionGate";

const PART_INFO: Record<
  ExamPart,
  { title: string; description: string; duration: string; tips: string[] }
> = {
  part1: {
    title: "Part 1 - Interview",
    description:
      "The examiner asks you questions about yourself, your life, interests, and opinions. This is a warm-up to help you settle in.",
    duration: "2 minutes",
    tips: [
      "Give extended answers, not just yes or no",
      "Use a range of tenses naturally",
      "Show personality - the examiner wants to hear your real opinions",
      "If you do not understand a question, ask for clarification",
    ],
  },
  part2: {
    title: "Part 2 - Long Turn",
    description:
      "You are given a task card with a topic. You have 1 minute to prepare, then speak for 1-2 minutes on the topic.",
    duration: "3-4 minutes",
    tips: [
      "Use the preparation time to make brief notes",
      "Structure your answer: introduction, main points, conclusion",
      "Keep talking - even if you are not sure, keep the flow going",
      "Use discourse markers like 'firstly', 'on the other hand', 'to sum up'",
    ],
  },
  part3: {
    title: "Part 3 - Collaborative Task",
    description:
      "You discuss a topic with the examiner, exchanging ideas, expressing and justifying opinions, and reaching a conclusion.",
    duration: "4 minutes",
    tips: [
      "Interact naturally - agree, disagree, ask for opinions",
      "Use phrases like 'What do you think about...?' and 'I see your point, but...'",
      "Try to reach a decision or conclusion together",
      "Show you can negotiate and compromise",
    ],
  },
  part4: {
    title: "Part 4 - Discussion",
    description:
      "A deeper discussion related to the Part 3 topic. The examiner asks more abstract questions to test your ability to discuss complex ideas.",
    duration: "5 minutes",
    tips: [
      "Express nuanced opinions with hedging language",
      "Use complex grammar structures naturally",
      "Support your arguments with examples",
      "Do not be afraid to speculate using 'might', 'could', 'it is possible that'",
    ],
  },
};

export default function ExamPartScreen() {
  const { level, part } = useLocalSearchParams<{
    level: string;
    part: string;
  }>();
  const router = useRouter();
  const { requirePremium } = useSubscriptionGate();
  const info = PART_INFO[part as ExamPart] ?? PART_INFO.part1;
  const isPart1 = part === "part1";

  const handleStart = () => {
    // Parts 2/3/4 require premium
    if (!isPart1) {
      const allowed = requirePremium(`/exam/session/${Date.now()}`);
      if (!allowed) return;
    }

    const sessionId = Date.now().toString();
    router.push({
      pathname: `/exam/session/${sessionId}` as any,
      params: {
        level: level ? String(level).toUpperCase() : "B2",
        part: part ?? "part1",
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          className="mb-6 self-start rounded-lg border-2 border-black bg-white px-4 py-2"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 3,
          }}
        >
          <Text className="text-base font-bold">Back</Text>
        </Pressable>

        {/* Level badge */}
        <View className="mb-4 self-start rounded-full border-2 border-black bg-violet-300 px-4 py-1">
          <Text className="text-sm font-bold text-black">
            {level?.toUpperCase()}
          </Text>
        </View>

        {/* Part title */}
        <Text className="mb-3 text-3xl font-black text-black">
          {info.title}
        </Text>

        {/* Description card */}
        <View
          className="mb-5 rounded-lg border-2 border-black bg-white p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-base leading-6 text-gray-800">
            {info.description}
          </Text>
        </View>

        {/* Duration */}
        <View
          className="mb-5 flex-row items-center rounded-lg border-2 border-black bg-sky-200 p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-lg font-bold text-black">Duration: </Text>
          <Text className="text-lg text-black">{info.duration}</Text>
        </View>

        {/* Tips card */}
        <View
          className="mb-8 rounded-lg border-2 border-black bg-green-200 p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-3 text-lg font-black text-black">Tips</Text>
          {info.tips.map((tip, i) => (
            <View key={i} className="mb-2 flex-row">
              <Text className="mr-2 text-base font-bold text-black">
                {i + 1}.
              </Text>
              <Text className="flex-1 text-base leading-6 text-gray-800">
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Start button */}
      <View className="px-5 pb-4">
        <Pressable
          onPress={handleStart}
          className="items-center rounded-lg border-2 border-black bg-blue-400 py-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-xl font-black text-black">Start</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
