import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md">
        <Text className="text-2xl font-bold text-text-primary mb-lg">
          Practice
        </Text>

        {/* Exam Level Selection */}
        <Text className="text-lg font-semibold text-text-secondary mb-md">
          Select your exam level
        </Text>

        <View className="gap-md">
          {/* B2 First */}
          <Pressable className="p-lg bg-surface rounded-lg border-2 border-exam-b2">
            <Text className="text-xl font-bold text-exam-b2">B2 First</Text>
            <Text className="text-text-muted mt-xs">
              Cambridge First Certificate
            </Text>
          </Pressable>

          {/* C1 Advanced */}
          <Pressable className="p-lg bg-surface rounded-lg border-2 border-exam-c1">
            <Text className="text-xl font-bold text-exam-c1">C1 Advanced</Text>
            <Text className="text-text-muted mt-xs">
              Cambridge Advanced Certificate
            </Text>
          </Pressable>

          {/* C2 Proficiency */}
          <Pressable className="p-lg bg-surface rounded-lg border-2 border-exam-c2">
            <Text className="text-xl font-bold text-exam-c2">
              C2 Proficiency
            </Text>
            <Text className="text-text-muted mt-xs">
              Cambridge Proficiency Certificate
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
