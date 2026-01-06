// Exam Session Screen
// Orchestrates exam parts 1-4 with proper flow

import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/Colors';
import { BreathingCircle } from '@/components/exam/BreathingCircle';
import { PhotoDisplay, PLACEHOLDER_IMAGES } from '@/components/exam/PhotoDisplay';
import { useExamSession } from '@/features/exam/hooks/useExamSession';
import { useExamTimer } from '@/features/exam/hooks/useExamTimer';
import { useConversationalAI } from '@/features/voice/hooks/useConversationalAI';
import { useMonologueRecording } from '@/features/voice/hooks/useMonologueRecording';
import type { ExamLevel, ExamPart, Part1Content, Part2Content, Part3Content, Part4Content } from '@/types/exam';

// Mock exam content - in production, this comes from the backend
const MOCK_CONTENT: Record<ExamPart, Part1Content | Part2Content | Part3Content | Part4Content> = {
  part1: {
    type: 'part1',
    questions: [
      "Can you tell me your full name, please?",
      "Where are you from?",
      "What do you like most about your hometown?",
      "What do you enjoy doing in your free time?",
      "What are your plans for the future?",
    ],
  },
  part2: {
    type: 'part2',
    images: PLACEHOLDER_IMAGES.slice(0, 2),
    prompt: "Compare these two photographs and say which person seems to be enjoying their activity more.",
    followUpQuestion: "Do you prefer indoor or outdoor activities?",
  },
  part3: {
    type: 'part3',
    prompt: "How can people stay healthy?",
    options: [
      "Regular exercise",
      "Eating balanced meals",
      "Getting enough sleep",
      "Managing stress",
      "Regular health check-ups",
    ],
    centralQuestion: "Which of these is most important for staying healthy?",
  },
  part4: {
    type: 'part4',
    topic: "Health and lifestyle",
    questions: [
      "Do you think people today are more health-conscious than in the past?",
      "Why do you think some people find it difficult to maintain a healthy lifestyle?",
      "What role should governments play in promoting public health?",
      "How has technology affected people's health habits?",
    ],
  },
};

export default function ExamSessionScreen() {
  const { id, level: levelParam } = useLocalSearchParams<{ id: string; level?: string }>();
  const level = (levelParam as ExamLevel) || 'B2';
  const isFreeTrial = id === 'free-trial';

  // Session management
  const {
    session,
    currentPart,
    currentPartConfig,
    isSessionActive,
    isComplete,
    startSession,
    completeCurrentPart,
    abandonSession,
  } = useExamSession({ level, isFreeTrial });

  // Timer
  const timer = useExamTimer({
    targetDuration: currentPartConfig?.duration || 120,
    onTimeUp: () => {
      // Time's up - handled by examiner or auto-advance
    },
  });

  // Voice hooks (conditional based on part type)
  const isConversational = currentPartConfig?.isConversational ?? true;
  const currentContent = currentPart ? MOCK_CONTENT[currentPart] : MOCK_CONTENT.part1;

  const conversationalAI = useConversationalAI({
    level,
    part: currentPart || 'part1',
    content: currentContent,
    useMock: true, // Use mock for development
  });

  const monologue = useMonologueRecording({
    targetDuration: 60,
    useMock: true,
  });

  // Local state
  const [partPhase, setPartPhase] = useState<'intro' | 'active' | 'followup' | 'complete'>('intro');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    if (!session) {
      startSession(MOCK_CONTENT as Record<ExamPart, Part1Content | Part2Content | Part3Content | Part4Content>);
    }
  }, [session, startSession]);

  // Start timer and voice when part begins
  useEffect(() => {
    if (isSessionActive && currentPart && partPhase === 'active') {
      timer.start();

      if (isConversational) {
        conversationalAI.connect();
      }
    }

    return () => {
      timer.reset();
      if (isConversational && conversationalAI.isConnected) {
        conversationalAI.disconnect();
      }
    };
  }, [currentPart, partPhase, isSessionActive]);

  // Handle session completion
  useEffect(() => {
    if (isComplete && session) {
      router.replace(`/exam/results/${session.id}`);
    }
  }, [isComplete, session]);

  // Start current part
  const handleStartPart = useCallback(async () => {
    setPartPhase('active');
  }, []);

  // Complete current part
  const handleCompletePart = useCallback(async () => {
    if (!currentPart || !currentPartConfig) return;

    setIsLoading(true);
    const duration = timer.stop();

    try {
      let transcript = '';

      if (isConversational) {
        const session = await conversationalAI.disconnect();
        transcript = session.fullTranscriptText;
      } else {
        const audioUri = await monologue.stopRecording();
        if (audioUri) {
          const sttResult = await monologue.transcribe();
          transcript = sttResult?.transcript || '';
        }
      }

      // Mock scores for now - in production, this calls the grading service
      completeCurrentPart({
        content: currentContent,
        userTranscript: transcript,
        durationSeconds: duration,
        targetDurationSeconds: currentPartConfig.duration,
        scores: {
          grammar: 3.5,
          vocabulary: 3.5,
          discourse: 4.0,
          pronunciation: 3.5,
          interaction: 4.0,
          globalAchievement: 3.5,
        },
        feedback: {
          summary: 'Good performance overall.',
          strengths: ['Clear communication', 'Good vocabulary range'],
          improvements: ['Work on complex grammar structures'],
          grammarErrors: [],
          vocabularyNotes: [],
          pronunciationFlags: [],
          examplePhrases: [],
        },
      });

      setPartPhase('intro');
    } finally {
      setIsLoading(false);
    }
  }, [currentPart, currentPartConfig, isConversational, conversationalAI, monologue, timer, completeCurrentPart, currentContent]);

  // End session early
  const handleEndSession = useCallback(() => {
    Alert.alert(
      'End Session?',
      'Are you sure you want to end this exam session? Your progress will be saved.',
      [
        { text: 'Continue Exam', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            abandonSession();
            router.replace(`/exam/results/${id}`);
          },
        },
      ]
    );
  }, [abandonSession, id]);

  // Render intro screen for current part
  const renderIntro = () => (
    <View className="flex-1 items-center justify-center p-lg">
      <View className="bg-surface rounded-2xl p-xl max-w-sm w-full">
        <Text className="text-2xl font-bold text-text-primary text-center mb-md">
          {currentPartConfig?.name || 'Exam Part'}
        </Text>
        <Text className="text-text-secondary text-center mb-xl">
          {currentPartConfig?.description}
        </Text>
        <Text className="text-text-muted text-center text-sm mb-lg">
          Duration: ~{Math.round((currentPartConfig?.duration || 120) / 60)} minutes
        </Text>

        <Pressable
          onPress={handleStartPart}
          className="bg-primary p-lg rounded-xl"
        >
          <Text className="text-text-primary text-center font-bold text-lg">
            Start Part
          </Text>
        </Pressable>
      </View>
    </View>
  );

  // Render active exam part
  const renderActive = () => {
    // Part 2 (Long Turn) - show photos
    if (currentPart === 'part2' && currentContent.type === 'part2') {
      return (
        <View className="flex-1">
          <PhotoDisplay
            images={currentContent.images}
            prompt={currentContent.prompt}
            layout="horizontal"
          />

          {/* Recording indicator */}
          <View className="absolute bottom-24 left-0 right-0 items-center">
            <View className="flex-row items-center gap-sm bg-surface/80 px-lg py-md rounded-full">
              <View className="w-3 h-3 rounded-full bg-error animate-pulse" />
              <Text className="text-text-primary">
                {monologue.isRecording ? 'Recording...' : 'Ready'}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View className="absolute bottom-12 left-0 right-0 flex-row justify-center gap-lg">
            {!monologue.isRecording ? (
              <Pressable
                onPress={monologue.startRecording}
                className="bg-primary px-xl py-md rounded-full"
              >
                <Text className="text-text-primary font-bold">Start Speaking</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleCompletePart}
                disabled={isLoading}
                className="bg-secondary-500 px-xl py-md rounded-full"
              >
                <Text className="text-text-primary font-bold">
                  {isLoading ? 'Processing...' : 'Finish'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      );
    }

    // Conversational parts (1, 3, 4) - show breathing circle
    return (
      <View className="flex-1 items-center justify-center">
        <BreathingCircle
          isActive={conversationalAI.isConnected}
          isSpeaking={conversationalAI.isSpeaking}
          isListening={conversationalAI.isListening}
          size="large"
        />

        <Text className="text-text-secondary mt-xl text-center px-lg">
          {conversationalAI.isSpeaking
            ? 'The examiner is speaking...'
            : conversationalAI.isListening
              ? 'Your turn to speak...'
              : 'Connecting...'}
        </Text>

        {/* End part button */}
        <View className="absolute bottom-12 left-0 right-0 items-center">
          <Pressable
            onPress={handleCompletePart}
            disabled={isLoading}
            className="bg-surface/80 px-xl py-md rounded-full"
          >
            <Text className="text-text-muted">
              {isLoading ? 'Processing...' : 'End Part'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar hidden />

      {/* Main content based on phase */}
      {partPhase === 'intro' ? renderIntro() : renderActive()}

      {/* Emergency exit - always visible but subtle */}
      <View className="absolute top-12 right-4">
        <Pressable
          onPress={handleEndSession}
          className="p-sm"
        >
          <Text className="text-text-muted text-sm">Exit</Text>
        </Pressable>
      </View>

      {/* Part indicator */}
      {currentPart && (
        <View className="absolute top-12 left-4">
          <Text className="text-text-muted text-sm">
            {currentPartConfig?.name}
          </Text>
        </View>
      )}
    </View>
  );
}
