import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettingsStore } from "@/stores/settingsStore";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

const STEPS = [
  {
    number: "1",
    title: "Practice daily",
    description: "Short sessions, big results. Max 45 minutes a day keeps you sharp.",
    color: "#FEF3C7",
    emoji: "🎙️",
  },
  {
    number: "2",
    title: "AI examiner feedback",
    description: "Get scored on grammar, vocabulary, pronunciation, and more.",
    color: "#D1FAE5",
    emoji: "🤖",
  },
  {
    number: "3",
    title: "Track your progress",
    description: "See your improvement over time with detailed analytics and streaks.",
    color: "#E0E7FF",
    emoji: "📊",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withDelay(
      600 + index * 200,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 150).duration(500)}>
      <View
        className="flex-row items-center p-5 rounded-3xl mb-4"
        style={{
          backgroundColor: step.color,
          borderWidth: 2,
          borderColor: "#000",
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 3,
        }}
      >
        {/* Number badge + emoji */}
        <View className="mr-4 items-center">
          <Animated.View style={emojiStyle}>
            <Text style={{ fontSize: 36 }}>{step.emoji}</Text>
          </Animated.View>
          <View
            className="items-center justify-center mt-2"
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#000",
            }}
          >
            <Text
              className="text-sm"
              style={{ fontWeight: "900", color: "#FFF" }}
            >
              {step.number}
            </Text>
          </View>
        </View>

        {/* Text */}
        <View className="flex-1">
          <Text
            className="text-lg mb-1"
            style={{ fontWeight: "800", color: "#000" }}
          >
            {step.title}
          </Text>
          <Text
            className="text-sm leading-5"
            style={{ fontWeight: "500", color: "#374151" }}
          >
            {step.description}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function TutorialScreen() {
  const setOnboardingComplete = useSettingsStore((s) => s.setOnboardingComplete);

  const handleStart = () => {
    setOnboardingComplete(true);
    router.replace("/(tabs)");
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
            How it works
          </Text>
          <Text
            className="text-base mb-8"
            style={{ fontWeight: "500", color: "#64748B" }}
          >
            Three simple steps to exam success.
          </Text>
        </Animated.View>

        {/* Steps */}
        <View className="flex-1 justify-center">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}

          {/* Connecting line decoration */}
          <View
            className="absolute self-center"
            style={{
              left: 52,
              top: 90,
              width: 2,
              height: 200,
              backgroundColor: "#E5E7EB",
              borderRadius: 1,
              zIndex: -1,
            }}
          />
        </View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(750).duration(500)} className="mb-8">
          <Pressable
            onPress={handleStart}
            className="w-full items-center justify-center py-4 rounded-2xl"
            style={{
              backgroundColor: "#7C3AED",
              borderWidth: 2,
              borderColor: "#000",
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 4,
            }}
          >
            <Text
              className="text-lg"
              style={{ fontWeight: "800", color: "#FFF" }}
            >
              Start Practicing
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
