import { View, Text } from 'react-native';
import { colors } from '@/constants/Colors';

type ExamLevel = 'B2' | 'C1' | 'C2';

interface BadgeProps {
  level: ExamLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const levelColors: Record<ExamLevel, string> = {
  B2: colors.exam.b2,
  C1: colors.exam.c1,
  C2: colors.exam.c2,
};

const levelNames: Record<ExamLevel, string> = {
  B2: 'B2 First',
  C1: 'C1 Advanced',
  C2: 'C2 Proficiency',
};

export function Badge({ level, size = 'md', className = '' }: BadgeProps) {
  const sizeStyles = {
    sm: 'px-xs py-xs',
    md: 'px-sm py-xs',
    lg: 'px-md py-sm',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={`rounded ${sizeStyles[size]} ${className}`}
      style={{ backgroundColor: `${levelColors[level]}20` }}
    >
      <Text
        className={`font-semibold ${textSizeStyles[size]}`}
        style={{ color: levelColors[level] }}
      >
        {levelNames[level]}
      </Text>
    </View>
  );
}
