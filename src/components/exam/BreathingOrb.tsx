import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";

interface BreathingOrbProps {
  isActive: boolean;
  isSpeaking: boolean;
}

const BLUE_COLORS = ["#3B82F6", "#60A5FA", "#93C5FD"] as const;
const VIOLET_COLOR = "#8B5CF6";

const IDLE_CYCLE_MS = 4000;
const SPEAKING_CYCLE_MS = 1500;

export function BreathingOrb({ isActive, isSpeaking }: BreathingOrbProps) {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isActive) {
      progress.value = 0;
      scale.value = 1;
      return;
    }

    const cycleDuration = isSpeaking ? SPEAKING_CYCLE_MS : IDLE_CYCLE_MS;
    const half = cycleDuration / 2;

    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: half, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: half, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(isSpeaking ? 1.3 : 1.15, {
          duration: half,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: half,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1
    );
  }, [isActive, isSpeaking]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = isSpeaking
      ? interpolateColor(
          progress.value,
          [0, 0.5, 1],
          [VIOLET_COLOR, "#A78BFA", VIOLET_COLOR]
        )
      : interpolateColor(
          progress.value,
          [0, 0.5, 1],
          [BLUE_COLORS[0], BLUE_COLORS[1], BLUE_COLORS[2]]
        );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className="items-center justify-center">
      {/* Outer glow */}
      <View
        className="absolute h-44 w-44 rounded-full"
        style={{
          backgroundColor: isSpeaking
            ? "rgba(139, 92, 246, 0.15)"
            : "rgba(59, 130, 246, 0.15)",
        }}
      />
      {/* Main orb */}
      <Animated.View
        className="h-32 w-32 rounded-full"
        style={animatedStyle}
      />
    </View>
  );
}
