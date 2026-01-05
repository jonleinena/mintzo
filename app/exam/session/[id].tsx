import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/constants/Colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function ExamSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Breathing animation for the floating circle
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    // Create breathing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000 }),
        withTiming(0.6, { duration: 2000 })
      ),
      -1,
      true
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleEndSession = () => {
    // TODO: End session and show results
    router.replace(`/exam/results/${id}`);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Minimal UI - just the breathing circle for non-visual parts */}
      <View className="flex-1 items-center justify-center">
        {/* Outer glow */}
        <Animated.View
          style={[animatedStyle]}
          className="absolute w-48 h-48 rounded-full"
        >
          <View
            className="w-full h-full rounded-full"
            style={{ backgroundColor: colors.primary[400] }}
          />
        </Animated.View>

        {/* Inner circle */}
        <View
          className="w-32 h-32 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary.DEFAULT }}
        >
          <Text className="text-4xl">🎤</Text>
        </View>

        {/* Status text */}
        <Text className="text-text-secondary mt-xl text-center px-lg">
          Speak naturally. The AI examiner is listening...
        </Text>
      </View>

      {/* Emergency exit button - subtle */}
      <View className="absolute bottom-12 left-0 right-0 items-center">
        <Pressable
          onPress={handleEndSession}
          className="px-lg py-md bg-surface/50 rounded-full"
        >
          <Text className="text-text-muted">End Session</Text>
        </Pressable>
      </View>
    </View>
  );
}
