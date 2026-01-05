import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function ExamResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isFreeTrial = id === 'free-trial';

  // Mock results - will be fetched from backend
  const mockResults = {
    overallScore: 3.8,
    level: 'B2',
    parts: [
      { name: 'Part 1: Interview', score: 4.0 },
      { name: 'Part 2: Long Turn', score: 3.5 },
      { name: 'Part 3: Collaborative', score: 4.0 },
      { name: 'Part 4: Discussion', score: 3.7 },
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return colors.success;
    if (score >= 3.5) return colors.secondary.DEFAULT;
    if (score >= 2.5) return colors.warning;
    return colors.error;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-md">
          {/* Header */}
          <View className="items-center mb-2xl">
            <Text className="text-6xl mb-md">🎉</Text>
            <Text className="text-3xl font-bold text-text-primary">
              Session Complete!
            </Text>
          </View>

          {/* Overall Score */}
          <View className="bg-surface rounded-lg p-xl items-center mb-lg">
            <Text className="text-text-muted mb-sm">Overall Score</Text>
            <Text
              className="text-6xl font-bold"
              style={{ color: getScoreColor(mockResults.overallScore) }}
            >
              {mockResults.overallScore.toFixed(1)}
            </Text>
            <Text className="text-text-secondary mt-sm">
              out of 5.0 • {mockResults.level} Level
            </Text>
          </View>

          {/* Part Scores */}
          <View className="bg-surface rounded-lg p-lg mb-lg">
            <Text className="text-lg font-semibold text-text-primary mb-md">
              Part Scores
            </Text>
            <View className="gap-md">
              {mockResults.parts.map((part) => (
                <View
                  key={part.name}
                  className="flex-row justify-between items-center"
                >
                  <Text className="text-text-secondary">{part.name}</Text>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(part.score) }}
                  >
                    {part.score.toFixed(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Free Trial Upsell */}
          {isFreeTrial && (
            <View className="bg-primary/10 rounded-lg p-lg mb-lg border border-primary">
              <Text className="text-xl font-bold text-primary text-center mb-sm">
                Want detailed feedback?
              </Text>
              <Text className="text-text-secondary text-center mb-md">
                Upgrade to Premium to unlock:
              </Text>
              <View className="gap-xs mb-md">
                <Text className="text-text-secondary text-center">
                  • Detailed grammar feedback
                </Text>
                <Text className="text-text-secondary text-center">
                  • Vocabulary suggestions
                </Text>
                <Text className="text-text-secondary text-center">
                  • Pronunciation analysis
                </Text>
                <Text className="text-text-secondary text-center">
                  • Personalized practice plan
                </Text>
              </View>
              <Pressable
                className="p-md bg-primary rounded-lg"
                onPress={() => router.push('/subscription')}
              >
                <Text className="text-text-primary text-center font-bold">
                  Unlock Premium
                </Text>
              </Pressable>
            </View>
          )}

          {/* Actions */}
          <View className="gap-md">
            <Pressable
              className="p-lg bg-surface rounded-lg"
              onPress={() => router.replace('/(tabs)/practice')}
            >
              <Text className="text-text-primary text-center font-semibold">
                Practice Again
              </Text>
            </Pressable>

            <Pressable
              className="p-md"
              onPress={() => router.replace('/(tabs)')}
            >
              <Text className="text-text-muted text-center">Go to Home</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
