import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { BreathingOrb } from "@/components/exam/BreathingOrb";

export default function ExamSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleEndExam = () => {
    router.replace(`/exam/session/results/${id}`);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <SafeAreaView className="flex-1 items-center justify-center">
        {/* Breathing orb */}
        <BreathingOrb isActive isSpeaking={false} />

        {/* Status text */}
        <Text className="mt-10 text-2xl font-bold text-white">
          Exam in progress...
        </Text>
        <Text className="mt-2 text-base text-gray-400">
          Session {id}
        </Text>

        {/* End exam button */}
        <Pressable
          onPress={handleEndExam}
          className="mt-16 rounded-lg border-2 border-red-500 bg-red-500/20 px-8 py-4"
        >
          <Text className="text-lg font-bold text-red-400">End Exam</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
