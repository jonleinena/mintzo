import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettingsStore } from "@/stores/settingsStore";

export default function FreeTrialScreen() {
  const router = useRouter();
  const { targetExamLevel } = useSettingsStore();

  const handleStartTrial = () => {
    router.push(`/exam/${targetExamLevel}/part1`);
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <View className="flex-1 px-5 pt-6">
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          className="mb-8 self-start rounded-lg border-2 border-black bg-white px-4 py-2"
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

        <Text className="mb-3 text-3xl font-black text-black">
          Free Trial Exam
        </Text>
        <Text className="mb-8 text-base leading-6 text-gray-600">
          Try a full Cambridge {targetExamLevel} speaking exam for free. See how
          Mintzo works and get your grade.
        </Text>

        {/* What you get */}
        <View
          className="mb-5 rounded-lg border-2 border-black bg-green-200 p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-3 text-lg font-black text-black">
            Free Trial Includes
          </Text>
          <Text className="mb-2 text-base text-gray-800">
            - 1 full speaking exam (all 4 parts)
          </Text>
          <Text className="mb-2 text-base text-gray-800">
            - Overall grade (Pass / Borderline / Fail)
          </Text>
          <Text className="text-base text-gray-800">
            - Cambridge scale score
          </Text>
        </View>

        {/* Premium includes */}
        <View
          className="mb-8 rounded-lg border-2 border-black bg-violet-200 p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-3 text-lg font-black text-black">
            Premium Includes
          </Text>
          <Text className="mb-2 text-base text-gray-800">
            - Unlimited exams and practice sessions
          </Text>
          <Text className="mb-2 text-base text-gray-800">
            - Detailed feedback per criterion
          </Text>
          <Text className="mb-2 text-base text-gray-800">
            - Grammar and vocabulary correction
          </Text>
          <Text className="mb-2 text-base text-gray-800">
            - Progress tracking and analytics
          </Text>
          <Text className="text-base text-gray-800">
            - Personalized study plan
          </Text>
        </View>
      </View>

      {/* Start button */}
      <View className="px-5 pb-4">
        <Pressable
          onPress={handleStartTrial}
          className="items-center rounded-lg border-2 border-black bg-blue-400 py-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-xl font-black text-black">
            Start Free Trial
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
