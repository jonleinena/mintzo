// Exam Results Screen
// Shows detailed feedback for premium users, grade only for free trial

import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/constants/Colors';
import { ProgressBar } from '@/components/ui';
import type { ExamResults, ExamGrade, ExamLevel } from '@/types/exam';
import { CAMBRIDGE_SCALE, EXAM_LEVELS } from '@/constants/examConfig';

// Mock results - in production, fetch from backend using session ID
const createMockResults = (level: ExamLevel, isFreeTrial: boolean): ExamResults => ({
  sessionId: 'mock-session',
  level,
  isFreeTrial,
  partResults: [
    {
      partId: 'part1-result',
      part: 'part1',
      content: { type: 'part1', questions: [] },
      userTranscript: '',
      durationSeconds: 120,
      targetDurationSeconds: 120,
      completedAt: new Date(),
      scores: {
        grammar: 3.5,
        vocabulary: 4.0,
        discourse: 3.5,
        pronunciation: 3.0,
        interaction: 4.0,
        globalAchievement: 3.5,
      },
      feedback: {
        summary: 'Good performance in the interview section.',
        strengths: ['Confident responses', 'Good vocabulary range', 'Natural interaction'],
        improvements: ['Work on pronunciation of complex words', 'Use more varied sentence structures'],
        grammarErrors: [
          { error: 'more better', correction: 'much better', severity: 'minor' },
          { error: 'I am agree', correction: 'I agree', severity: 'minor' },
        ],
        vocabularyNotes: [
          { used: 'good', suggestion: 'excellent/beneficial' },
          { used: 'very big', suggestion: 'enormous/substantial' },
        ],
        pronunciationFlags: [],
        examplePhrases: ['From my perspective...', 'I would argue that...', 'On the other hand...'],
      },
    },
    {
      partId: 'part2-result',
      part: 'part2',
      content: { type: 'part2', images: [], prompt: '', followUpQuestion: '' },
      userTranscript: '',
      durationSeconds: 65,
      targetDurationSeconds: 60,
      completedAt: new Date(),
      scores: {
        grammar: 3.5,
        vocabulary: 3.5,
        discourse: 4.0,
        pronunciation: 3.5,
        interaction: 3.5,
        globalAchievement: 3.5,
      },
      feedback: {
        summary: 'Good comparison of photos with relevant observations.',
        strengths: ['Well-structured response', 'Good use of comparison language'],
        improvements: ['Could expand more on the reasons'],
        grammarErrors: [],
        vocabularyNotes: [],
        pronunciationFlags: [],
        examplePhrases: [],
      },
    },
  ],
  averageScores: {
    grammar: 3.5,
    vocabulary: 3.75,
    discourse: 3.75,
    pronunciation: 3.25,
    interaction: 3.75,
    globalAchievement: 3.5,
  },
  cambridgeScale: 168,
  grade: 'B',
  xpEarned: 120,
  recommendation: undefined,
  completedAt: new Date(),
});

export default function ExamResultsScreen() {
  const { id, level: levelParam } = useLocalSearchParams<{ id: string; level?: string }>();
  const isFreeTrial = id === 'free-trial';
  const level = (levelParam as ExamLevel) || 'B2';

  // Use mock results for now
  const results = createMockResults(level, isFreeTrial);

  const getGradeColor = (grade: ExamGrade): string => {
    switch (grade) {
      case 'A':
      case 'Above Level':
        return colors.secondary.DEFAULT;
      case 'B':
        return colors.primary.DEFAULT;
      case 'C':
        return colors.warning;
      case 'Fail':
        return colors.error;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 4.5) return colors.secondary.DEFAULT;
    if (score >= 3.5) return colors.primary.DEFAULT;
    if (score >= 2.5) return colors.warning;
    return colors.error;
  };

  const scaleConfig = CAMBRIDGE_SCALE[results.level];
  const levelConfig = EXAM_LEVELS[results.level];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-md">
          {/* Header */}
          <View className="items-center mb-xl">
            <Text className="text-6xl mb-md">
              {results.grade === 'Fail' ? '📚' : '🎉'}
            </Text>
            <Text className="text-3xl font-bold text-text-primary">
              Session Complete!
            </Text>
            {results.xpEarned > 0 && (
              <Text className="text-secondary-400 mt-sm">
                +{results.xpEarned} XP earned
              </Text>
            )}
          </View>

          {/* Overall Score Card */}
          <View className="bg-surface rounded-2xl p-xl mb-lg">
            <View className="items-center mb-lg">
              <Text className="text-text-muted mb-xs">Cambridge Scale Score</Text>
              <Text
                className="text-6xl font-bold"
                style={{ color: getGradeColor(results.grade) }}
              >
                {results.cambridgeScale}
              </Text>
              <View className="flex-row items-center gap-sm mt-sm">
                <View
                  className="px-md py-xs rounded-full"
                  style={{ backgroundColor: getGradeColor(results.grade) + '20' }}
                >
                  <Text
                    className="font-bold"
                    style={{ color: getGradeColor(results.grade) }}
                  >
                    Grade {results.grade}
                  </Text>
                </View>
                <Text className="text-text-muted">•</Text>
                <Text
                  className="font-medium"
                  style={{ color: levelConfig.color }}
                >
                  {levelConfig.name}
                </Text>
              </View>
            </View>

            {/* Scale visualization */}
            <View className="mb-md">
              <View className="flex-row justify-between mb-xs">
                <Text className="text-text-muted text-xs">{scaleConfig.min}</Text>
                <Text className="text-text-muted text-xs">{scaleConfig.max}</Text>
              </View>
              <View className="h-3 bg-surface-secondary rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${((results.cambridgeScale - scaleConfig.min) / (scaleConfig.max - scaleConfig.min)) * 100}%`,
                    backgroundColor: getGradeColor(results.grade),
                  }}
                />
              </View>
              <View className="flex-row justify-between mt-xs">
                <Text className="text-text-muted text-xs">
                  Pass: {scaleConfig.pass}
                </Text>
                <Text className="text-text-muted text-xs">
                  Grade A: {scaleConfig.gradeA}
                </Text>
              </View>
            </View>

            {results.recommendation && (
              <View className="bg-primary/10 p-md rounded-lg mt-md">
                <Text className="text-primary text-center">
                  {results.recommendation}
                </Text>
              </View>
            )}
          </View>

          {/* Free Trial Upsell */}
          {isFreeTrial && (
            <View className="bg-surface rounded-2xl p-lg mb-lg border border-primary/30">
              <Text className="text-xl font-bold text-primary text-center mb-sm">
                Unlock Detailed Feedback
              </Text>
              <Text className="text-text-secondary text-center mb-md">
                Get personalized insights to improve faster:
              </Text>
              <View className="gap-sm mb-lg">
                {[
                  'Grammar error corrections',
                  'Vocabulary suggestions',
                  'Pronunciation analysis',
                  'Personalized practice plan',
                  'Progress tracking & streaks',
                ].map((feature) => (
                  <View key={feature} className="flex-row items-center gap-sm">
                    <Text className="text-secondary-400">✓</Text>
                    <Text className="text-text-secondary">{feature}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                className="bg-primary p-lg rounded-xl"
                onPress={() => router.push('/subscription')}
              >
                <Text className="text-text-primary text-center font-bold text-lg">
                  Unlock Premium
                </Text>
              </Pressable>
            </View>
          )}

          {/* Detailed Scores - Premium Only */}
          {!isFreeTrial && (
            <>
              {/* Criteria Breakdown */}
              <View className="bg-surface rounded-2xl p-lg mb-lg">
                <Text className="text-lg font-bold text-text-primary mb-lg">
                  Assessment Breakdown
                </Text>
                <View className="gap-lg">
                  {[
                    { name: 'Grammar', score: results.averageScores.grammar },
                    { name: 'Vocabulary', score: results.averageScores.vocabulary },
                    { name: 'Discourse Management', score: results.averageScores.discourse },
                    { name: 'Pronunciation', score: results.averageScores.pronunciation },
                    { name: 'Interactive Communication', score: results.averageScores.interaction },
                    { name: 'Global Achievement', score: results.averageScores.globalAchievement },
                  ].map(({ name, score }) => (
                    <View key={name}>
                      <View className="flex-row justify-between mb-xs">
                        <Text className="text-text-secondary">{name}</Text>
                        <Text
                          className="font-bold"
                          style={{ color: getScoreColor(score) }}
                        >
                          {score.toFixed(1)}/5.0
                        </Text>
                      </View>
                      <ProgressBar
                        progress={score / 5}
                        color={getScoreColor(score)}
                        height={8}
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* Feedback Section */}
              <View className="bg-surface rounded-2xl p-lg mb-lg">
                <Text className="text-lg font-bold text-text-primary mb-lg">
                  Detailed Feedback
                </Text>

                {/* Strengths */}
                <View className="mb-lg">
                  <Text className="text-secondary-400 font-semibold mb-sm">
                    ✓ Strengths
                  </Text>
                  {results.partResults[0]?.feedback.strengths.map((strength, i) => (
                    <Text key={i} className="text-text-secondary mb-xs">
                      • {strength}
                    </Text>
                  ))}
                </View>

                {/* Improvements */}
                <View className="mb-lg">
                  <Text className="text-warning font-semibold mb-sm">
                    ⚠ Areas to Improve
                  </Text>
                  {results.partResults[0]?.feedback.improvements.map((improvement, i) => (
                    <Text key={i} className="text-text-secondary mb-xs">
                      • {improvement}
                    </Text>
                  ))}
                </View>

                {/* Grammar Errors */}
                {results.partResults[0]?.feedback.grammarErrors.length > 0 && (
                  <View className="mb-lg">
                    <Text className="text-error font-semibold mb-sm">
                      Grammar Corrections
                    </Text>
                    {results.partResults[0].feedback.grammarErrors.map((error, i) => (
                      <View key={i} className="bg-error/10 p-md rounded-lg mb-sm">
                        <Text className="text-error line-through">{error.error}</Text>
                        <Text className="text-secondary-400">→ {error.correction}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Vocabulary Notes */}
                {results.partResults[0]?.feedback.vocabularyNotes.length > 0 && (
                  <View className="mb-lg">
                    <Text className="text-primary font-semibold mb-sm">
                      Vocabulary Suggestions
                    </Text>
                    {results.partResults[0].feedback.vocabularyNotes.map((note, i) => (
                      <View key={i} className="bg-primary/10 p-md rounded-lg mb-sm">
                        <Text className="text-text-muted">Instead of "{note.used}":</Text>
                        <Text className="text-primary font-medium">→ {note.suggestion}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Example Phrases */}
                {results.partResults[0]?.feedback.examplePhrases?.length > 0 && (
                  <View>
                    <Text className="text-secondary-400 font-semibold mb-sm">
                      💡 Useful Phrases to Practice
                    </Text>
                    {results.partResults[0].feedback.examplePhrases.map((phrase, i) => (
                      <Text key={i} className="text-text-secondary mb-xs italic">
                        "{phrase}"
                      </Text>
                    ))}
                  </View>
                )}
              </View>

              {/* Part-by-Part Scores */}
              <View className="bg-surface rounded-2xl p-lg mb-lg">
                <Text className="text-lg font-bold text-text-primary mb-lg">
                  Part Scores
                </Text>
                <View className="gap-md">
                  {results.partResults.map((part) => {
                    const partConfig = EXAM_LEVELS[results.level].parts.find(
                      (p) => p.part === part.part
                    );
                    const avgScore =
                      Object.values(part.scores).reduce((a, b) => a + b, 0) /
                      Object.values(part.scores).length;

                    return (
                      <View
                        key={part.partId}
                        className="flex-row justify-between items-center py-sm border-b border-surface-secondary"
                      >
                        <View>
                          <Text className="text-text-primary font-medium">
                            {partConfig?.name || part.part}
                          </Text>
                          <Text className="text-text-muted text-sm">
                            {Math.round(part.durationSeconds / 60)}m {part.durationSeconds % 60}s
                          </Text>
                        </View>
                        <Text
                          className="text-xl font-bold"
                          style={{ color: getScoreColor(avgScore) }}
                        >
                          {avgScore.toFixed(1)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {/* Actions */}
          <View className="gap-md mb-xl">
            <Pressable
              className="p-lg bg-primary rounded-xl"
              onPress={() => router.replace('/(tabs)/practice')}
            >
              <Text className="text-text-primary text-center font-bold text-lg">
                Practice Again
              </Text>
            </Pressable>

            <Pressable
              className="p-lg bg-surface rounded-xl"
              onPress={() => router.replace('/(tabs)')}
            >
              <Text className="text-text-secondary text-center font-semibold">
                Go to Home
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
