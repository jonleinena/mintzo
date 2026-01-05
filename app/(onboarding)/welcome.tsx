import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md justify-center items-center">
        <Text className="text-5xl mb-lg">🎯</Text>
        <Text className="text-4xl font-bold text-text-primary text-center mb-md">
          Mintzo
        </Text>
        <Text className="text-xl text-text-secondary text-center mb-2xl">
          Ace your Cambridge Speaking Exam with AI-powered practice
        </Text>

        <View className="w-full gap-md">
          <Pressable
            className="p-lg bg-primary rounded-lg"
            onPress={() => router.push('/(onboarding)/select-level')}
          >
            <Text className="text-text-primary text-center font-semibold text-lg">
              Get Started
            </Text>
          </Pressable>

          <Pressable
            className="p-lg border border-surface-secondary rounded-lg"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-text-secondary text-center font-semibold text-lg">
              I already have an account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
