import { useEffect } from 'react';
import { Image, View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BreathingOrb } from '@/components/exam/BreathingOrb';
import { useLongTurn } from '@/features/voice/hooks/useLongTurn';
import type { ExamLevel, ConversationTurn } from '@/types/exam';

interface Part2LongTurnProps {
  level: ExamLevel;
  onComplete: (transcript: ConversationTurn[]) => void;
}

function PhotoPlaceholder({ point, index }: { point: string; index: number }) {
  const colors = ['#1E3A5F', '#2D1B4E', '#1B3D2F'];
  const bgColor = colors[index % colors.length];

  return (
    <View
      className="flex-1 items-center justify-center rounded-lg p-3"
      style={{ backgroundColor: bgColor, minHeight: 100 }}
    >
      <Text className="text-center text-sm text-white/90">{point}</Text>
    </View>
  );
}

function TimerDisplay({ seconds }: { seconds: number }) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${minutes}:${secs.toString().padStart(2, '0')}`;
  const isLow = seconds <= 10;

  return (
    <Text className={`text-3xl font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
      {display}
    </Text>
  );
}

export function Part2LongTurn({ level, onComplete }: Part2LongTurnProps) {
  const { state, content, timeRemaining, startExam, stopExam } = useLongTurn({
    level,
    onComplete,
    onError: (error) => {
      console.error('Part 2 error:', error);
    },
  });

  useEffect(() => {
    startExam();
    return () => {
      stopExam();
    };
  }, [startExam, stopExam]);

  if (state === 'loading' || !content) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <StatusBar hidden />
        <ActivityIndicator color="#ffffff" size="large" />
        <Text className="mt-4 text-base text-gray-400">Loading Part 2 content...</Text>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <StatusBar hidden />
        <Text className="text-lg text-red-400">Something went wrong</Text>
        <Pressable
          onPress={startExam}
          className="mt-6 rounded-lg border border-white/30 px-6 py-3"
        >
          <Text className="text-base text-white">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const isSpeakingPhase = state === 'speaking' || state === 'follow_up_recording';
  const isExaminerSpeaking = state === 'prep' || state === 'follow_up_speaking';
  const hasImages = content.imageUrls.length > 0 && Boolean(content.imageUrls[0]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        >
          {hasImages && (
            <View className="mb-4 mt-2 flex-row gap-2">
              {content.imageUrls.map((url, i) => (
                <View key={i} className="flex-1">
                  <Image
                    source={{ uri: url }}
                    className="w-full rounded-lg"
                    style={{ height: 160 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          )}
          {!hasImages && content.comparisonPoints.length > 0 && (
            <View className="mb-4 mt-2 flex-row gap-2">
              {content.comparisonPoints.slice(0, 3).map((point, i) => (
                <PhotoPlaceholder key={i} point={point} index={i} />
              ))}
            </View>
          )}

          {/* Prompt text card */}
          <View className="mb-4 rounded-xl bg-white/10 p-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {state === 'follow_up_speaking' || state === 'follow_up_recording'
                ? 'Follow-up Question'
                : 'Your Task'}
            </Text>
            <Text className="mt-2 text-base leading-6 text-white">
              {state === 'follow_up_speaking' || state === 'follow_up_recording'
                ? content.followUpQuestion
                : content.promptText}
            </Text>
          </View>

          {/* State indicator */}
          <View className="mb-2 items-center">
            {state === 'prep' && (
              <Text className="text-sm text-blue-400">Listen to the examiner...</Text>
            )}
            {state === 'speaking' && (
              <Text className="text-sm text-green-400">Speak now - compare the photos</Text>
            )}
            {state === 'follow_up_speaking' && (
              <Text className="text-sm text-blue-400">Listen to the follow-up question...</Text>
            )}
            {state === 'follow_up_recording' && (
              <Text className="text-sm text-green-400">Answer the follow-up question</Text>
            )}
            {state === 'complete' && (
              <Text className="text-sm text-gray-400">Part 2 complete</Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom area: timer + orb */}
        <View className="items-center pb-6">
          {isSpeakingPhase && <TimerDisplay seconds={timeRemaining} />}

          <View className="mt-4">
            <BreathingOrb
              isActive={isExaminerSpeaking || isSpeakingPhase}
              isSpeaking={isExaminerSpeaking}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
