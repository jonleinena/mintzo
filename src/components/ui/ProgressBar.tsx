import { View } from 'react-native';
import { colors } from '@/constants/Colors';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  className?: string;
}

export function ProgressBar({
  progress,
  color = colors.primary.DEFAULT,
  backgroundColor = colors.surface.secondary,
  height = 8,
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View
      className={`rounded-full overflow-hidden ${className}`}
      style={{ height, backgroundColor }}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
