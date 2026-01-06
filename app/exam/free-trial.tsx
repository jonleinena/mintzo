import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function FreeTrialScreen() {
  const handleStartExam = () => {
    // TODO: Create exam session and navigate
    router.push('/exam/session/free-trial');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md">
        <View className="flex-row justify-end mb-md">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted text-lg">✕</Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-center items-center">
          <Text className="text-6xl mb-lg">🎁</Text>
          <Text className="text-3xl font-bold text-text-primary text-center mb-md">
            Free Practice Session
          </Text>
          <Text className="text-text-secondary text-center mb-2xl px-lg">
            Experience a complete B2 First speaking exam simulation. You&apos;ll
            receive your overall grade at the end.
          </Text>

          {/* What&apos;s included */}
          <View className="w-full bg-surface rounded-lg p-lg mb-2xl">
            <Text className="text-lg font-semibold text-text-primary mb-md">
              What&apos;s included:
            </Text>
            <View className="gap-sm">
              <Text className="text-text-secondary">
                • Part 1: Interview (2 min)
              </Text>
              <Text className="text-text-secondary">
                • Part 2: Long Turn (4 min)
              </Text>
              <Text className="text-text-secondary">
                • Part 3: Collaborative Task (4 min)
              </Text>
              <Text className="text-text-secondary">
                • Part 4: Discussion (4 min)
              </Text>
            </View>
          </View>

          {/* Note about premium */}
          <View className="bg-primary/10 rounded-lg p-md mb-xl w-full">
            <Text className="text-primary text-center">
              Upgrade to Premium for detailed feedback, corrections, and
              improvement suggestions.
            </Text>
          </View>
        </View>

        <Pressable
          className="p-lg bg-primary rounded-lg"
          onPress={handleStartExam}
        >
          <Text className="text-text-primary text-center font-bold text-lg">
            Start Practice Session
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
