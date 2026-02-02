import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { BreathingOrb } from '@/components/exam/BreathingOrb';
import { useConversationalAI } from '@/features/voice/hooks/useConversationalAI';
import type { ExamLevel, ExamPart } from '@/types/exam';

interface ConversationScreenProps {
  level: ExamLevel;
  part: ExamPart;
  onComplete: (transcript: string) => void;
}

export function ConversationScreen({ level, part, onComplete }: ConversationScreenProps) {
  const { status, isSpeaking, startSession, endSession, canStart } =
    useConversationalAI({
      level,
      part,
      onSessionEnd: onComplete,
    });

  useEffect(() => {
    if (canStart) {
      startSession();
    }

    return () => {
      endSession();
    };
  }, [canStart, startSession, endSession]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <BreathingOrb isActive={status === 'connected'} isSpeaking={isSpeaking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
