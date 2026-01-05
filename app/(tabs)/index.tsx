import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md">
        <Text className="text-2xl font-bold text-text-primary mb-md">
          Welcome to Mintzo
        </Text>
        <Text className="text-text-secondary">
          Your Cambridge Speaking Exam practice companion
        </Text>

        {/* Practice Plan Section - Placeholder */}
        <View className="mt-lg p-md bg-surface rounded-lg">
          <Text className="text-lg font-semibold text-text-primary mb-sm">
            Your Practice Plan
          </Text>
          <Text className="text-text-muted">
            Set up your exam date to get started
          </Text>
        </View>

        {/* Today's Goals Section - Placeholder */}
        <View className="mt-md p-md bg-surface rounded-lg">
          <Text className="text-lg font-semibold text-text-primary mb-sm">
            Today&apos;s Goals
          </Text>
          <Text className="text-text-muted">0/45 minutes completed</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
