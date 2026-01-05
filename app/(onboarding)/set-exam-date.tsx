import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function SetExamDateScreen() {
  const handleSetDate = () => {
    // TODO: Implement date picker and store date
    router.push('/(onboarding)/tutorial');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/tutorial');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md">
        <Text className="text-3xl font-bold text-text-primary mb-md">
          When is your exam?
        </Text>
        <Text className="text-text-secondary mb-2xl">
          We&apos;ll create a personalized practice plan to help you prepare.
        </Text>

        <View className="flex-1 justify-center">
          {/* Date Picker Placeholder */}
          <Pressable
            className="p-xl bg-surface rounded-lg items-center"
            onPress={handleSetDate}
          >
            <Text className="text-6xl mb-md">📅</Text>
            <Text className="text-xl text-text-primary font-semibold">
              Select Exam Date
            </Text>
            <Text className="text-text-muted mt-sm">Tap to choose a date</Text>
          </Pressable>
        </View>

        <View className="gap-md">
          <Pressable
            className="p-lg bg-primary rounded-lg"
            onPress={handleSetDate}
          >
            <Text className="text-text-primary text-center font-semibold text-lg">
              Continue
            </Text>
          </Pressable>

          <Pressable onPress={handleSkip}>
            <Text className="text-text-muted text-center">
              I&apos;ll set this later
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
