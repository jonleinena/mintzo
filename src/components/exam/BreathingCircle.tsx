// Breathing Circle Component
// Calming animation for conversational exam parts (Parts 1, 3, 4)

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/constants/Colors';

interface BreathingCircleProps {
  isActive?: boolean;
  isSpeaking?: boolean; // Agent is speaking
  isListening?: boolean; // User is speaking
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: { outer: 120, inner: 80 },
  medium: { outer: 192, inner: 128 },
  large: { outer: 256, inner: 176 },
};

export function BreathingCircle({
  isActive = true,
  isSpeaking = false,
  isListening = false,
  size = 'medium',
}: BreathingCircleProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  // Different animation based on state
  useEffect(() => {
    if (!isActive) {
      scale.value = 1;
      opacity.value = 0.4;
      return;
    }

    if (isSpeaking) {
      // Faster pulse when agent is speaking
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 300 }),
          withTiming(0.7, { duration: 300 })
        ),
        -1,
        true
      );
    } else if (isListening) {
      // Medium pulse when listening
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 500 }),
          withTiming(0.65, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      // Slow breathing animation (idle)
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
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
    }
  }, [isActive, isSpeaking, isListening, scale, opacity]);

  const outerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const dimensions = SIZES[size];

  // Determine color based on state
  const getCircleColor = () => {
    if (isSpeaking) return colors.primary[500];
    if (isListening) return colors.secondary[500];
    return colors.primary[400];
  };

  return (
    <View style={styles.container}>
      {/* Outer animated glow */}
      <Animated.View
        style={[
          styles.outerCircle,
          outerAnimatedStyle,
          {
            width: dimensions.outer,
            height: dimensions.outer,
            borderRadius: dimensions.outer / 2,
            backgroundColor: getCircleColor(),
          },
        ]}
      />

      {/* Inner circle */}
      <View
        style={[
          styles.innerCircle,
          {
            width: dimensions.inner,
            height: dimensions.inner,
            borderRadius: dimensions.inner / 2,
            backgroundColor: isSpeaking
              ? colors.primary.DEFAULT
              : isListening
                ? colors.secondary.DEFAULT
                : colors.primary.DEFAULT,
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          {isSpeaking ? (
            <SpeakingIcon />
          ) : isListening ? (
            <ListeningIcon />
          ) : (
            <IdleIcon />
          )}
        </View>
      </View>
    </View>
  );
}

// Simple icon components
function SpeakingIcon() {
  return (
    <View style={styles.iconWrapper}>
      <View style={[styles.soundBar, { height: 20 }]} />
      <View style={[styles.soundBar, { height: 30 }]} />
      <View style={[styles.soundBar, { height: 20 }]} />
    </View>
  );
}

function ListeningIcon() {
  return (
    <View style={styles.micIcon}>
      <View style={styles.micHead} />
      <View style={styles.micBase} />
    </View>
  );
}

function IdleIcon() {
  return (
    <View style={styles.idleDot} />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'absolute',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  soundBar: {
    width: 4,
    backgroundColor: colors.text.primary,
    borderRadius: 2,
  },
  micIcon: {
    alignItems: 'center',
  },
  micHead: {
    width: 16,
    height: 24,
    backgroundColor: colors.text.primary,
    borderRadius: 8,
  },
  micBase: {
    width: 24,
    height: 4,
    backgroundColor: colors.text.primary,
    borderRadius: 2,
    marginTop: 4,
  },
  idleDot: {
    width: 12,
    height: 12,
    backgroundColor: colors.text.primary,
    borderRadius: 6,
  },
});
