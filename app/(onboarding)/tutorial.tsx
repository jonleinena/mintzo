import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function TutorialScreen() {
  const handleComplete = () => {
    // TODO: Mark onboarding as complete in state
    router.replace('/(tabs)');
  };

  const handleTryFreeTrial = () => {
    // TODO: Navigate to free trial exam
    router.push('/exam/free-trial');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md">
        <Text className="text-3xl font-bold text-text-primary mb-md">
          How Mintzo Works
        </Text>

        <View className="flex-1 gap-lg mt-lg">
          {/* Step 1 */}
          <View className="flex-row gap-md">
            <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
              <Text className="text-xl font-bold text-text-primary">1</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text-primary">
                Practice Speaking
              </Text>
              <Text className="text-text-secondary">
                Have real conversations with our AI examiner, just like the real
                exam.
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View className="flex-row gap-md">
            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
              <Text className="text-xl font-bold text-text-primary">2</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text-primary">
                Get Instant Feedback
              </Text>
              <Text className="text-text-secondary">
                Receive detailed scores and suggestions to improve your
                grammar, vocabulary, and pronunciation.
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View className="flex-row gap-md">
            <View className="w-12 h-12 bg-exam-c1 rounded-full items-center justify-center">
              <Text className="text-xl font-bold text-text-primary">3</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text-primary">
                Track Your Progress
              </Text>
              <Text className="text-text-secondary">
                Build streaks, earn XP, and watch your contributions graph grow
                as you improve.
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-md">
          <Pressable
            className="p-lg bg-primary rounded-lg"
            onPress={handleTryFreeTrial}
          >
            <Text className="text-text-primary text-center font-semibold text-lg">
              Try a Free Practice Session
            </Text>
          </Pressable>

          <Pressable onPress={handleComplete}>
            <Text className="text-text-muted text-center">
              Skip to home screen
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
