import { Text, View } from "react-native";
import clsx from "clsx";

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({
  progress,
  color = "bg-brand-violet",
  height = 16,
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const percent = Math.round(clamped * 100);

  return (
    <View className="w-full">
      <View
        className="border-2 border-black rounded-sm bg-surface-secondary overflow-hidden"
        style={{ height }}
      >
        <View
          className={clsx("h-full rounded-sm", color)}
          style={{ width: `${percent}%` }}
        />
      </View>
      {showLabel && (
        <Text className="text-sm font-bold text-black mt-1 text-right">
          {percent}%
        </Text>
      )}
    </View>
  );
}
