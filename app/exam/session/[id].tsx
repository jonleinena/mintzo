import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { BreathingOrb } from "@/components/exam/BreathingOrb";
import { ConversationScreen } from "@/components/exam/ConversationScreen";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScriptedExam } from "@/features/voice/hooks/useScriptedExam";
import type { ConversationTurn, ExamLevel, ExamPart } from "@/types/exam";
import { getRandomQuestions } from "@/services/api/examContentApi";
import { gradeExam } from "@/services/api/voiceApi";

function normalizeLevel(value?: string): ExamLevel {
  const upper = value?.toUpperCase();
  if (upper === "B2" || upper === "C1" || upper === "C2") {
    return upper;
  }
  return "B2";
}

function normalizePart(value?: string): ExamPart {
  if (value === "part1" || value === "part2" || value === "part3" || value === "part4") {
    return value;
  }
  return "part1";
}

export default function ExamSessionScreen() {
  const { id, level, part } = useLocalSearchParams<{
    id: string;
    level?: string;
    part?: string;
  }>();
  const router = useRouter();

  const examLevel = useMemo(() => normalizeLevel(level), [level]);
  const examPart = useMemo(() => normalizePart(part), [part]);
  const isScripted = examPart === "part1" || examPart === "part4";

  const [questions, setQuestions] = useState<
    Array<{ id: string; questionText: string; audioUrl?: string | null }>
  >([]);
  const [isLoading, setIsLoading] = useState(isScripted);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const transcriptsRef = useRef<Record<string, string>>({});

  const handleExamComplete = useCallback(
    async (fullTranscript: ConversationTurn[]) => {
      // Convert transcript array to string
      const transcriptText = fullTranscript
        .map((turn) => `${turn.role}: ${turn.text}`)
        .join("\n");

      // Store transcript for this part
      transcriptsRef.current[examPart] = transcriptText;

      // Grade the exam
      setIsGrading(true);
      try {
        await gradeExam(id, transcriptsRef.current, examLevel);
      } catch (error) {
        console.error("Grading failed:", error);
        // Still navigate to results even if grading fails
      } finally {
        setIsGrading(false);
        router.replace(`/exam/session/results/${id}`);
      }
    },
    [id, examLevel, examPart, router],
  );

  const { state, startExam, stopExam } = useScriptedExam({
    level: examLevel,
    part: examPart,
    questions,
    onComplete: handleExamComplete,
    onError: (error) => {
      setLoadError(error.message);
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      if (!isScripted) return;

      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await getRandomQuestions(examLevel, examPart, examPart === "part1" ? 6 : 5);
        if (!isMounted) return;
        const mapped = (data ?? []).map((item: any) => ({
          id: item.id,
          questionText: item.question_text,
          audioUrl: item.audio_url ?? null,
        }));
        setQuestions(mapped);
      } catch (error) {
        if (!isMounted) return;
        setLoadError((error as Error).message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [examLevel, examPart, isScripted]);

  useEffect(() => {
    if (!isScripted) return;
    if (isLoading || questions.length === 0) return;
    startExam();

    return () => {
      stopExam();
    };
  }, [isLoading, isScripted, questions.length, startExam, stopExam]);

  const handleEndExam = () => {
    router.replace(`/exam/session/results/${id}`);
  };

  const handlePart3Complete = useCallback(
    async (transcript: string) => {
      transcriptsRef.current["part3"] = transcript;
      setIsGrading(true);
      try {
        await gradeExam(id, transcriptsRef.current, examLevel);
      } catch (error) {
        console.error("Grading failed:", error);
      } finally {
        setIsGrading(false);
        router.replace(`/exam/session/results/${id}`);
      }
    },
    [id, examLevel, router],
  );

  if (examPart === "part3") {
    return (
      <ConversationScreen
        level={examLevel}
        part={examPart}
        onComplete={handlePart3Complete}
      />
    );
  }

  if (!isScripted) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar hidden />
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-semibold text-white">
            This part is not wired yet.
          </Text>
          <Text className="mt-3 text-center text-base text-gray-400">
            We will add Part 2 visuals and recording next. For now, use Part 1 or Part 3.
          </Text>
          <Pressable
            onPress={handleEndExam}
            className="mt-8 rounded-lg border-2 border-white/40 bg-white/10 px-6 py-3"
          >
            <Text className="text-base font-bold text-white">Back</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <BreathingOrb isActive isSpeaking={state === "examiner_speaking"} />

        {isGrading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator color="#ffffff" />
            <Text className="mt-3 text-base text-gray-300">
              Grading your exam...
            </Text>
          </View>
        ) : isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator color="#ffffff" />
            <Text className="mt-3 text-base text-gray-300">
              Preparing your questions...
            </Text>
          </View>
        ) : loadError ? (
          <View className="mt-10 items-center">
            <Text className="text-base text-red-300">
              {loadError}
            </Text>
          </View>
        ) : (
          <View className="mt-10 items-center">
            <Text className="text-2xl font-bold text-white">
              {examPart === "part1" ? "Interview in progress..." : "Discussion in progress..."}
            </Text>
            <Text className="mt-2 text-base text-gray-400">
              Session {id}
            </Text>
          </View>
        )}

        <Pressable
          onPress={handleEndExam}
          className="mt-16 rounded-lg border-2 border-red-500 bg-red-500/20 px-8 py-4"
        >
          <Text className="text-lg font-bold text-red-400">End Exam</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
