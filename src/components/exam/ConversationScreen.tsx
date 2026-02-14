import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { BreathingOrb } from '@/components/exam/BreathingOrb';
import { MermaidDiagram } from '@/components/exam/MermaidDiagram';
import { useConversationalAI } from '@/features/voice/hooks/useConversationalAI';
import type { ExamLevel, ExamPart } from '@/types/exam';

interface ConversationScreenProps {
  level: ExamLevel;
  part: ExamPart;
  onComplete: (transcript: string) => void;
}

export function ConversationScreen({ level, part, onComplete }: ConversationScreenProps) {
  const { status, isSpeaking, startSession, endSession, canStart, diagramMermaid } =
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
      {diagramMermaid && (
        <View style={styles.diagramContainer}>
          <MermaidDiagram chart={diagramMermaid} height={280} />
        </View>
      )}
      <View style={styles.orbContainer}>
        <BreathingOrb isActive={status === 'connected'} isSpeaking={isSpeaking} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  diagramContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  orbContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
