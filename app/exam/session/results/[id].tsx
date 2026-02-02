import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const CRITERIA = [
  { key: "grammar", label: "Grammar & Vocabulary", color: "bg-blue-300" },
  { key: "vocabulary", label: "Lexical Resource", color: "bg-green-300" },
  { key: "discourse", label: "Discourse Management", color: "bg-yellow-300" },
  { key: "pronunciation", label: "Pronunciation", color: "bg-pink-300" },
  { key: "interaction", label: "Interactive Communication", color: "bg-violet-300" },
  { key: "globalAchievement", label: "Global Achievement", color: "bg-orange-300" },
] as const;

function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  const maxScore = 5;
  const percentage = (score / maxScore) * 100;

  return (
    <View className="mb-4">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-sm font-bold text-black">{label}</Text>
        <Text className="text-sm font-bold text-gray-600">
          {score}/{maxScore}
        </Text>
      </View>
      <View className="h-6 overflow-hidden rounded-md border-2 border-black bg-gray-100">
        <View
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

export default function ExamResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Placeholder scores - all zero
  const scores = {
    grammar: 0,
    vocabulary: 0,
    discourse: 0,
    pronunciation: 0,
    interaction: 0,
    globalAchievement: 0,
  };

  const cambridgeScore = 0;
  const grade = "N/A";

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-2 text-3xl font-black text-black">
          Exam Results
        </Text>
        <Text className="mb-6 text-base text-gray-500">Session {id}</Text>

        {/* Grade card */}
        <View
          className="mb-6 items-center rounded-lg border-2 border-black bg-violet-200 p-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-1 text-base font-bold text-gray-700">
            Overall Grade
          </Text>
          <Text className="text-5xl font-black text-black">{grade}</Text>
          <Text className="mt-2 text-sm text-gray-600">
            Cambridge Scale: {cambridgeScore}
          </Text>
        </View>

        {/* Score breakdown */}
        <View
          className="mb-6 rounded-lg border-2 border-black bg-white p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-4 text-lg font-black text-black">
            Score Breakdown
          </Text>
          {CRITERIA.map((c) => (
            <ScoreBar
              key={c.key}
              label={c.label}
              score={scores[c.key]}
              color={c.color}
            />
          ))}
        </View>

        {/* Placeholder feedback */}
        <View
          className="mb-8 rounded-lg border-2 border-black bg-sky-200 p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-2 text-lg font-black text-black">Feedback</Text>
          <Text className="text-base leading-6 text-gray-700">
            Detailed feedback will appear here after your exam is graded by the
            AI examiner.
          </Text>
        </View>
      </ScrollView>

      {/* Back to home */}
      <View className="px-5 pb-4">
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          className="items-center rounded-lg border-2 border-black bg-green-300 py-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-xl font-black text-black">Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
