import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  valueLabel?: string;
};

export function ProgressRing({
  progress,
  size = 88,
  strokeWidth = 10,
  color = "#7C3AED",
  label = "Weekly goal",
  valueLabel,
}: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  return (
    <View className="items-center">
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View className="absolute items-center">
          <Text className="text-lg font-black text-black">
            {Math.round(clamped * 100)}%
          </Text>
          {valueLabel && (
            <Text className="text-[10px] text-slate-500">{valueLabel}</Text>
          )}
        </View>
      </View>
      <Text className="text-xs text-slate-500 mt-2">{label}</Text>
    </View>
  );
}
