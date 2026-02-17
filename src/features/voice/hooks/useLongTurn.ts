import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import type { ExamLevel, ConversationTurn } from '@/types/exam';
import { textToSpeech, playAudio } from '@/features/voice/services/elevenlabsTTS';
import { speechToText } from '@/features/voice/services/elevenlabsSTT';
import { VoiceActivityDetector } from '@/features/voice/services/voiceActivityDetection';
import { getRandomPart2Content } from '@/services/api/examContentApi';

export type LongTurnState =
  | 'loading'
  | 'prep'
  | 'speaking'
  | 'follow_up_speaking'
  | 'follow_up_recording'
  | 'complete'
  | 'error';

export interface Part2Content {
  id: string;
  topic: string;
  imageUrls: string[];
  promptText: string;
  followUpQuestion: string;
  comparisonPoints: string[];
}

interface UseLongTurnProps {
  level: ExamLevel;
  onComplete: (transcript: ConversationTurn[]) => void;
  onError?: (error: Error) => void;
}

const MAIN_SPEAKING_DURATION = 60000; // 60 seconds
const FOLLOW_UP_SPEAKING_DURATION = 30000; // 30 seconds

export function useLongTurn({ level, onComplete, onError }: UseLongTurnProps) {
  const [state, setState] = useState<LongTurnState>('loading');
  const [content, setContent] = useState<Part2Content | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const transcriptRef = useRef<ConversationTurn[]>([]);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const appendTranscript = useCallback((turn: ConversationTurn) => {
    transcriptRef.current = [...transcriptRef.current, turn];
  }, []);

  const startCountdown = useCallback((durationMs: number, onExpire: () => void) => {
    clearTimer();
    const endTime = Date.now() + durationMs;
    setTimeRemaining(Math.ceil(durationMs / 1000));

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        clearTimer();
        onExpire();
      }
    }, 500);
  }, [clearTimer]);

  const handleMainSpeechEnd = useCallback(async (audioUri: string) => {
    if (!isRunningRef.current) return;
    clearTimer();

    try {
      const result = await speechToText(audioUri);
      appendTranscript({
        role: 'candidate',
        text: result.text,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('STT failed for main speech:', error);
      appendTranscript({
        role: 'candidate',
        text: '[transcription failed]',
        timestamp: new Date(),
      });
    }

    // Move to follow-up phase
    if (!isRunningRef.current || !content) return;
    setState('follow_up_speaking');

    try {
      // Switch back to playback mode before TTS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // TTS reads the follow-up question
      const audioPath = await textToSpeech({ text: content.followUpQuestion });
      appendTranscript({
        role: 'examiner',
        text: content.followUpQuestion,
        timestamp: new Date(),
      });
      await playAudio(audioPath);

      if (!isRunningRef.current) return;

      // Start follow-up recording
      setState('follow_up_recording');

      vadRef.current = new VoiceActivityDetector(
        {
          onSpeechEnd: async (followUpUri) => {
            if (!isRunningRef.current) return;
            clearTimer();

            try {
              const followUpResult = await speechToText(followUpUri);
              appendTranscript({
                role: 'candidate',
                text: followUpResult.text,
                timestamp: new Date(),
              });
            } catch (error) {
              console.error('STT failed for follow-up:', error);
              appendTranscript({
                role: 'candidate',
                text: '[transcription failed]',
                timestamp: new Date(),
              });
            }

            setState('complete');
            onComplete(transcriptRef.current);
          },
        },
        { maxRecordingDuration: FOLLOW_UP_SPEAKING_DURATION },
      );

      await vadRef.current.start();

      startCountdown(FOLLOW_UP_SPEAKING_DURATION, async () => {
        await vadRef.current?.stop();
      });
    } catch (error) {
      setState('error');
      onError?.(error as Error);
    }
  }, [content, clearTimer, appendTranscript, startCountdown, onComplete, onError]);

  const startExam = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    transcriptRef.current = [];
    setState('loading');

    try {
      // Fetch Part 2 content
      const rawContent = await getRandomPart2Content(level);
      if (!rawContent) {
        throw new Error('No Part 2 content available for this level');
      }

      const part2Content: Part2Content = {
        id: rawContent.id,
        topic: rawContent.topic,
        imageUrls: rawContent.image_urls ?? [],
        promptText: rawContent.prompt_text,
        followUpQuestion: rawContent.follow_up_question,
        comparisonPoints: rawContent.comparison_points ?? [],
      };
      setContent(part2Content);

      // Switch to playback mode for TTS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // TTS reads the prompt
      setState('prep');
      const audioPath = await textToSpeech({ text: part2Content.promptText });
      appendTranscript({
        role: 'examiner',
        text: part2Content.promptText,
        timestamp: new Date(),
      });
      await playAudio(audioPath);

      if (!isRunningRef.current) return;

      // Start main speaking phase with VAD
      setState('speaking');

      vadRef.current = new VoiceActivityDetector(
        { onSpeechEnd: handleMainSpeechEnd },
        { maxRecordingDuration: MAIN_SPEAKING_DURATION },
      );

      await vadRef.current.start();

      startCountdown(MAIN_SPEAKING_DURATION, async () => {
        await vadRef.current?.stop();
      });
    } catch (error) {
      setState('error');
      onError?.(error as Error);
    }
  }, [level, appendTranscript, handleMainSpeechEnd, startCountdown, onError]);

  const stopExam = useCallback(async () => {
    isRunningRef.current = false;
    clearTimer();
    await vadRef.current?.cancel();
    setState('loading');
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      clearTimer();
      vadRef.current?.cancel();
    };
  }, [clearTimer]);

  return {
    state,
    content,
    timeRemaining,
    startExam,
    stopExam,
  };
}
