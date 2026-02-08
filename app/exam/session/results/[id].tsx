import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase/client";
import {
  calculateWeightedAverage,
  mapToCambridgeScale,
  determineGrade,
} from "@/features/scoring/services/gradingEngine";
import type { ExamLevel, ExamScores, ExamFeedback } from "@/types/exam";

const CRITERIA = [
  { key: "grammar", label: "Grammar & Vocabulary", color: "bg-blue-300" },
  { key: "vocabulary", label: "Lexical Resource", color: "bg-green-300" },
  { key: "discourse", label: "Discourse Management", color: "bg-yellow-300" },
  { key: "pronunciation", label: "Pronunciation", color: "bg-pink-300" },
  { key: "interaction", label: "Interactive Communication", color: "bg-violet-300" },
  { key: "globalAchievement", label: "Global Achievement", color: "bg-orange-300" },
] as const;

interface SessionResult {
  level: ExamLevel;
  scores: ExamScores | null;
  xp_earned: number;
  status: string;
}

interface PartResult {
  part: string;
  feedback: ExamFeedback | null;
}

function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  const maxScore = 5;
  const percentage = (score / maxScore) * 100;

  return (
    <View className="mb-4">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-sm font-bold text-black">{label}</Text>
        <Text className="text-sm font-bold text-gray-600">
          {score.toFixed(1)}/{maxScore}
        </Text>
      </View>
      <View className="h-6 overflow-hidden rounded-md border-2 border-black bg-gray-100">
        <View
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

export default function ExamResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<SessionResult | null>(null);
  const [feedback, setFeedback] = useState<ExamFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      if (!id) return;

      try {
        // Fetch session data
        const { data: sessionData, error: sessionError } = await supabase
          .from("exam_sessions")
          .select("level, scores, xp_earned, status")
          .eq("id", id)
          .single();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        setSession(sessionData as SessionResult);

        // Fetch part results for feedback
        const { data: partResults, error: partError } = await supabase
          .from("exam_part_results")
          .select("part, feedback")
          .eq("session_id", id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!partError && partResults && partResults.length > 0) {
          setFeedback((partResults[0] as PartResult).feedback);
        }
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [id]);

  // Default scores if not available
  const scores: ExamScores = session?.scores ?? {
    grammar: 0,
    vocabulary: 0,
    discourse: 0,
    pronunciation: 0,
    interaction: 0,
    globalAchievement: 0,
  };

  const level = session?.level ?? "B2";
  const averageScore = calculateWeightedAverage(scores);
  const cambridgeScore = mapToCambridgeScale(averageScore, level);
  const grade = determineGrade(cambridgeScore, level);
  const xpEarned = session?.xp_earned ?? 0;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-amber-50">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-base text-gray-600">Loading results...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-amber-50 px-6">
        <Text className="text-lg font-bold text-red-600">Error loading results</Text>
        <Text className="mt-2 text-center text-base text-gray-600">{error}</Text>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          className="mt-6 rounded-lg border-2 border-black bg-green-300 px-6 py-3"
        >
          <Text className="font-bold text-black">Back to Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-2 text-3xl font-black text-black">
          Exam Results
        </Text>
        <Text className="mb-6 text-base text-gray-500">{level} Speaking Test</Text>

        {/* Grade card */}
        <View
          className="mb-6 items-center rounded-lg border-2 border-black bg-violet-200 p-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-1 text-base font-bold text-gray-700">
            Overall Grade
          </Text>
          <Text className="text-5xl font-black text-black">{grade}</Text>
          <Text className="mt-2 text-sm text-gray-600">
            Cambridge Scale: {cambridgeScore}
          </Text>
          {xpEarned > 0 && (
            <Text className="mt-2 text-sm font-bold text-violet-700">
              +{xpEarned} XP
            </Text>
          )}
        </View>

        {/* Score breakdown */}
        <View
          className="mb-6 rounded-lg border-2 border-black bg-white p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-4 text-lg font-black text-black">
            Score Breakdown
          </Text>
          {CRITERIA.map((c) => (
            <ScoreBar
              key={c.key}
              label={c.label}
              score={scores[c.key]}
              color={c.color}
            />
          ))}
        </View>

        {/* Feedback section */}
        <View
          className="mb-8 rounded-lg border-2 border-black bg-sky-200 p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="mb-2 text-lg font-black text-black">Feedback</Text>
          {feedback ? (
            <>
              <Text className="mb-4 text-base leading-6 text-gray-700">
                {feedback.summary}
              </Text>

              {feedback.strengths && feedback.strengths.length > 0 && (
                <View className="mb-4">
                  <Text className="mb-2 font-bold text-green-700">Strengths:</Text>
                  {feedback.strengths.map((strength, i) => (
                    <Text key={i} className="mb-1 text-sm text-gray-700">
                      - {strength}
                    </Text>
                  ))}
                </View>
              )}

              {feedback.improvements && feedback.improvements.length > 0 && (
                <View className="mb-4">
                  <Text className="mb-2 font-bold text-orange-700">Areas to Improve:</Text>
                  {feedback.improvements.map((improvement, i) => (
                    <Text key={i} className="mb-1 text-sm text-gray-700">
                      - {improvement}
                    </Text>
                  ))}
                </View>
              )}

              {feedback.examplePhrases && feedback.examplePhrases.length > 0 && (
                <View>
                  <Text className="mb-2 font-bold text-blue-700">Useful Phrases:</Text>
                  {feedback.examplePhrases.map((phrase, i) => (
                    <Text key={i} className="mb-1 text-sm italic text-gray-700">
                      "{phrase}"
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text className="text-base leading-6 text-gray-700">
              {session?.status === "completed"
                ? "Feedback is being generated..."
                : "Complete the exam to receive detailed feedback."}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Back to home */}
      <View className="px-5 pb-4">
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          className="items-center rounded-lg border-2 border-black bg-green-300 py-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-xl font-black text-black">Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
