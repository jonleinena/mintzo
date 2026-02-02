import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ExamLevel } from "@/types/exam";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const LEVELS: {
  id: ExamLevel;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  emoji: string;
}[] = [
  {
    id: "B2",
    title: "B2 First",
    subtitle: "FCE",
    description: "Familiar topics, common structures. Good starting point for most learners.",
    color: "#FEF3C7",
    emoji: "📗",
  },
  {
    id: "C1",
    title: "C1 Advanced",
    subtitle: "CAE",
    description: "Abstract topics, wide vocabulary range. For confident English speakers.",
    color: "#D1FAE5",
    emoji: "📘",
  },
  {
    id: "C2",
    title: "C2 Proficiency",
    subtitle: "CPE",
    description: "Near-native fluency. Sophisticated discourse and full grammatical control.",
    color: "#E0E7FF",
    emoji: "📕",
  },
];

function LevelCard({
  level,
  isSelected,
  onSelect,
  index,
}: {
  level: (typeof LEVELS)[number];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 120).duration(500)}>
      <AnimatedPressable
        onPress={() => {
          scale.value = withSpring(0.97, {}, () => {
            scale.value = withSpring(1);
          });
          onSelect();
        }}
        style={[animatedStyle]}
      >
        <View
          className="p-5 rounded-3xl mb-4"
          style={{
            backgroundColor: level.color,
            borderWidth: 2,
            borderColor: "#000",
            shadowColor: isSelected ? "#7C3AED" : "#000",
            shadowOffset: { width: isSelected ? 5 : 3, height: isSelected ? 5 : 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: isSelected ? 6 : 3,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-3">
              <Text style={{ fontSize: 28 }}>{level.emoji}</Text>
              <View>
                <Text
                  className="text-xl"
                  style={{ fontWeight: "900", color: "#000" }}
                >
                  {level.title}
                </Text>
                <Text
                  className="text-xs mt-0.5"
                  style={{ fontWeight: "700", color: "#64748B" }}
                >
                  {level.subtitle}
                </Text>
              </View>
            </View>
            {/* Selection indicator */}
            <View
              className="items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: "#000",
                backgroundColor: isSelected ? "#7C3AED" : "transparent",
              }}
            >
              {isSelected && (
                <Text className="text-white text-xs" style={{ fontWeight: "900" }}>
                  ✓
                </Text>
              )}
            </View>
          </View>
          <Text
            className="text-sm leading-5"
            style={{ fontWeight: "500", color: "#374151" }}
          >
            {level.description}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function SelectLevelScreen() {
  const [selected, setSelected] = useState<ExamLevel | null>(null);
  const setTargetExamLevel = useSettingsStore((s) => s.setTargetExamLevel);

  const handleContinue = () => {
    if (!selected) return;
    setTargetExamLevel(selected);
    router.push("/(onboarding)/set-exam-date");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        {/* Back */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Pressable
            onPress={() => router.back()}
            className="mb-6"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: "#000",
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800" }}>←</Text>
          </Pressable>
        </Animated.View>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mb-2">
          <Text
            className="text-3xl mb-2"
            style={{ fontWeight: "900", color: "#000", letterSpacing: -0.5 }}
          >
            Choose your exam
          </Text>
          <Text
            className="text-base mb-8"
            style={{ fontWeight: "500", color: "#64748B" }}
          >
            Which Cambridge exam are you preparing for?
          </Text>
        </Animated.View>

        {/* Level cards */}
        <View className="flex-1">
          {LEVELS.map((level, i) => (
            <LevelCard
              key={level.id}
              level={level}
              isSelected={selected === level.id}
              onSelect={() => setSelected(level.id)}
              index={i}
            />
          ))}
        </View>

        {/* Continue button */}
        <Animated.View entering={FadeInUp.delay(650).duration(500)} className="mb-8">
          <Pressable
            onPress={handleContinue}
            disabled={!selected}
            className="w-full items-center justify-center py-4 rounded-2xl"
            style={{
              backgroundColor: selected ? "#7C3AED" : "#E5E7EB",
              borderWidth: 2,
              borderColor: selected ? "#000" : "#D1D5DB",
              shadowColor: "#000",
              shadowOffset: { width: selected ? 4 : 0, height: selected ? 4 : 0 },
              shadowOpacity: selected ? 1 : 0,
              shadowRadius: 0,
              elevation: selected ? 4 : 0,
              opacity: selected ? 1 : 0.6,
            }}
          >
            <Text
              className="text-lg"
              style={{
                fontWeight: "800",
                color: selected ? "#FFF" : "#9CA3AF",
              }}
            >
              Continue
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
