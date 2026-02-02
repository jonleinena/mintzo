import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreRingProps {
  score: number; // 0 to 5
  size?: number;
  color?: string;
  label?: string;
}

export function ScoreRing({
  score,
  size = 100,
  color = "#7C3AED",
  label,
}: ScoreRingProps) {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(5, Math.max(0, score));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(clamped / 5, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-2xl font-bold text-black">
            {clamped.toFixed(1)}
          </Text>
        </View>
      </View>
      {label && (
        <Text className="text-sm font-bold text-black mt-1">{label}</Text>
      )}
    </View>
  );
}
