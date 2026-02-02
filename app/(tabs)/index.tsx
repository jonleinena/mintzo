import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuthStore } from "@/stores/authStore";
import { ExamCountdown } from "@/components/plan/ExamCountdown";
import { ProgressRing } from "@/components/plan/ProgressRing";
import { DailyPlan } from "@/components/plan/DailyPlan";
import { fetchWeeklyPracticeProgress } from "@/features/gamification/services/gamificationService";

function StatCard({
  label,
  value,
  icon,
  color = "bg-white",
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}) {
  return (
    <View
      className={`${color} border-2 border-black rounded-lg p-4 flex-1`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      }}
    >
      <Ionicons name={icon} size={20} color="#64748B" />
      <Text className="text-2xl font-black mt-2">{value}</Text>
      <Text className="text-xs text-slate-500 font-medium">{label}</Text>
    </View>
  );
}

function QuickAction({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`${color} border-2 border-black rounded-lg p-4 flex-row items-center`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      }}
    >
      <View className="bg-white border-2 border-black rounded-full w-12 h-12 items-center justify-center mr-4">
        <Ionicons name={icon} size={24} color="#000" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold">{title}</Text>
        <Text className="text-sm text-slate-600">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#000" />
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { targetExamLevel, targetExamDate, dailyPracticeGoal } =
    useSettingsStore();
  const { user } = useAuthStore();
  const [weeklyProgress, setWeeklyProgress] = useState({
    daysPracticed: 0,
    goalDays: 5,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    if (!user?.id) {
      setWeeklyProgress({ daysPracticed: 0, goalDays: 5, isLoading: false });
      return () => {
        isMounted = false;
      };
    }

    setWeeklyProgress((prev) => ({ ...prev, isLoading: true }));

    fetchWeeklyPracticeProgress(user.id)
      .then((progress) => {
        if (!isMounted) return;
        setWeeklyProgress({
          daysPracticed: progress.daysPracticed,
          goalDays: progress.goalDays,
          isLoading: false,
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setWeeklyProgress({ daysPracticed: 0, goalDays: 5, isLoading: false });
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const planItems = useMemo(() => [
    { title: "Part 1 warm-up", minutes: Math.round(dailyPracticeGoal * 0.2) },
    { title: "Part 2 long turn", minutes: Math.round(dailyPracticeGoal * 0.3) },
    { title: "Part 3 collaboration", minutes: Math.round(dailyPracticeGoal * 0.25) },
    {
      title: "Review feedback",
      minutes: Math.max(5, dailyPracticeGoal - Math.round(dailyPracticeGoal * 0.75)),
    },
  ], [dailyPracticeGoal]);

  const weeklyGoalProgress = weeklyProgress.goalDays > 0
    ? weeklyProgress.daysPracticed / weeklyProgress.goalDays
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View>
            <Text className="text-3xl font-black">Mintzo</Text>
            <Text className="text-sm text-slate-500 font-medium">
              {targetExamLevel} Speaking Practice
            </Text>
          </View>
          <View className="bg-surface-indigo border-2 border-black rounded-full w-10 h-10 items-center justify-center">
            <Ionicons name="flame" size={20} color="#7C3AED" />
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1">
            <ExamCountdown examDate={targetExamDate} />
          </View>
          <View
            className="bg-white border-2 border-black rounded-lg px-3 py-2 items-center justify-between"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 4,
              height: 124,
            }}
          >
            <Text className="text-[11px] text-slate-500 font-medium">
              Weekly goal
            </Text>
            <ProgressRing
              progress={weeklyGoalProgress}
              size={64}
              strokeWidth={6}
              label={null}
            />
            <Text className="text-[10px] text-slate-500">
              {weeklyProgress.isLoading
                ? "Loading..."
                : `${weeklyProgress.daysPracticed} / ${weeklyProgress.goalDays} days`}
            </Text>
          </View>
        </View>

        {/* Daily Plan */}
        <Text className="text-xl font-black mb-3">Your Plan</Text>
        <View className="mb-6">
          <DailyPlan
            totalMinutes={dailyPracticeGoal}
            completedMinutes={0}
            items={planItems}
          />
        </View>

        {/* Quick Actions */}
        <Text className="text-xl font-black mb-3">Quick Start</Text>
        <View className="gap-3 mb-8">
          <QuickAction
            title="Full Exam"
            subtitle="Practice all 4 parts"
            icon="reader"
            color="bg-surface-cream"
            onPress={() => router.push(`/exam/${targetExamLevel}/part1`)}
          />
          <QuickAction
            title="Single Part"
            subtitle="Focus on one area"
            icon="mic"
            color="bg-surface-mint"
            onPress={() => router.push("/(tabs)/practice")}
          />
          <QuickAction
            title="Review Results"
            subtitle="See past performance"
            icon="bar-chart"
            color="bg-surface-indigo"
            onPress={() => router.push("/(tabs)/progress")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
