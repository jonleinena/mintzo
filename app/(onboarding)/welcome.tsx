import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FloatingBubble({
  size,
  color,
  top,
  left,
  delay,
}: {
  size: number;
  color: string;
  top: number;
  left: number;
  delay: number;
}) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(12, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: "#000",
          top,
          left,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Top badge */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          className="self-start"
        >
          <View
            className="px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: "#E0E7FF",
              borderWidth: 1.5,
              borderColor: "#000",
            }}
          >
            <Text
              className="text-xs tracking-wider"
              style={{ fontWeight: "800", color: "#000" }}
            >
              CAMBRIDGE SPEAKING PREP
            </Text>
          </View>
        </Animated.View>

        {/* Illustration area with floating speech bubbles */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(700)}
          className="flex-1 items-center justify-center my-4"
        >
          {/* Main orb */}
          <View
            className="items-center justify-center"
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: "#FEF3C7",
              borderWidth: 2.5,
              borderColor: "#000",
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 72 }}>🗣️</Text>
          </View>

          {/* Floating accent bubbles */}
          <FloatingBubble size={44} color="#D1FAE5" top={20} left={40} delay={0} />
          <FloatingBubble size={32} color="#E0E7FF" top={60} left={280} delay={400} />
          <FloatingBubble size={28} color="#FEF3C7" top={200} left={60} delay={800} />
          <FloatingBubble size={36} color="#D1FAE5" top={180} left={260} delay={200} />
          <FloatingBubble size={20} color="#E0E7FF" top={100} left={20} delay={600} />

          {/* Speech tail decorations */}
          <View
            className="absolute"
            style={{
              bottom: 40,
              right: 80,
              width: 60,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#F3F4F6",
              borderWidth: 1.5,
              borderColor: "#000",
            }}
          />
          <View
            className="absolute"
            style={{
              bottom: 20,
              right: 60,
              width: 36,
              height: 16,
              borderRadius: 8,
              backgroundColor: "#F3F4F6",
              borderWidth: 1.5,
              borderColor: "#000",
            }}
          />
        </Animated.View>

        {/* Title block */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          className="mb-3"
        >
          <Text
            className="text-5xl mb-2"
            style={{ fontWeight: "900", color: "#000", letterSpacing: -1.5 }}
          >
            Mintzo
          </Text>
          <Text
            className="text-lg leading-7"
            style={{ fontWeight: "600", color: "#64748B" }}
          >
            Master Cambridge Speaking Exams{"\n"}with your AI practice partner.
          </Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View
          entering={FadeInUp.delay(550).duration(600)}
          className="flex-row flex-wrap gap-2 mb-8"
        >
          {["B2 First", "C1 Advanced", "C2 Proficiency"].map((label, i) => (
            <View
              key={label}
              className="px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: ["#FEF3C7", "#D1FAE5", "#E0E7FF"][i],
                borderWidth: 1.5,
                borderColor: "#000",
              }}
            >
              <Text className="text-sm" style={{ fontWeight: "700" }}>
                {label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA Button */}
        <Animated.View entering={FadeInUp.delay(700).duration(600)} className="mb-8">
          <AnimatedPressable
            onPress={() => router.push("/(onboarding)/select-level")}
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
              Get Started
            </Text>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
