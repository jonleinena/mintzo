import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-md">
        <Text className="text-2xl font-bold text-text-primary mb-lg">
          Your Progress
        </Text>

        {/* Streak Section */}
        <View className="p-md bg-surface rounded-lg mb-md">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-text-muted">Current Streak</Text>
              <Text className="text-3xl font-bold text-secondary">0 days</Text>
            </View>
            <View>
              <Text className="text-text-muted">Longest Streak</Text>
              <Text className="text-3xl font-bold text-text-primary">
                0 days
              </Text>
            </View>
          </View>
        </View>

        {/* XP & Level Section */}
        <View className="p-md bg-surface rounded-lg mb-md">
          <Text className="text-text-muted">Level 1</Text>
          <View className="h-2 bg-surface-secondary rounded-full mt-sm">
            <View className="h-2 bg-primary rounded-full w-0" />
          </View>
          <Text className="text-text-muted mt-sm">0 / 100 XP</Text>
        </View>

        {/* Contributions Graph Placeholder */}
        <View className="p-md bg-surface rounded-lg mb-md">
          <Text className="text-lg font-semibold text-text-primary mb-md">
            Practice Activity
          </Text>
          <Text className="text-text-muted">
            Your contributions graph will appear here
          </Text>
        </View>

        {/* Stats Summary */}
        <View className="p-md bg-surface rounded-lg">
          <Text className="text-lg font-semibold text-text-primary mb-md">
            Statistics
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-text-muted">Total Sessions</Text>
              <Text className="text-xl font-bold text-text-primary">0</Text>
            </View>
            <View>
              <Text className="text-text-muted">Total Time</Text>
              <Text className="text-xl font-bold text-text-primary">0 min</Text>
            </View>
            <View>
              <Text className="text-text-muted">Avg Score</Text>
              <Text className="text-xl font-bold text-text-primary">--</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
