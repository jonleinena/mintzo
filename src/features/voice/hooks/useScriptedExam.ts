import { useCallback, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import type { ExamLevel, ExamPart, ConversationTurn } from '@/types/exam';
import { playAudio, textToSpeech, uploadToCache } from '@/features/voice/services/elevenlabsTTS';
import { speechToText } from '@/features/voice/services/elevenlabsSTT';
import { VoiceActivityDetector } from '@/features/voice/services/voiceActivityDetection';

export type ScriptedExamState = 'idle' | 'examiner_speaking' | 'candidate_speaking' | 'complete' | 'error';

export interface ScriptedQuestion {
  id: string;
  questionText: string;
  audioUrl?: string | null;
}

interface UseScriptedExamProps {
  level: ExamLevel;
  part: ExamPart;
  questions: ScriptedQuestion[];
  onComplete: (transcript: ConversationTurn[]) => void;
  onError?: (error: Error) => void;
}

export function useScriptedExam({
  level,
  part,
  questions,
  onComplete,
  onError,
}: UseScriptedExamProps) {
  const [state, setState] = useState<ScriptedExamState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcript, setTranscript] = useState<ConversationTurn[]>([]);

  const transcriptRef = useRef<ConversationTurn[]>([]);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const isRunningRef = useRef(false);

  // Stable refs for callback props - avoids re-creating the loop on every render
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const appendTranscript = useCallback((turn: ConversationTurn) => {
    transcriptRef.current = [...transcriptRef.current, turn];
    setTranscript([...transcriptRef.current]);
  }, []);

  // Wait for the candidate to finish speaking via VAD + STT.
  // Returns transcribed text, or null if no speech was detected.
  const listenForAnswer = useCallback((): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      vadRef.current = new VoiceActivityDetector({
        onSpeechEnd: async (audioUri) => {
          try {
            const result = await speechToText(audioUri);
            resolve(result.text);
          } catch (err) {
            reject(err);
          }
        },
        onNoSpeech: () => {
          resolve(null);
        },
      });

      vadRef.current.start().catch(reject);
    });
  }, []);

  const runExamLoop = useCallback(
    async (qs: ScriptedQuestion[]) => {
      for (let i = 0; i < qs.length; i++) {
        if (!isRunningRef.current) return;

        const question = qs[i];
        setCurrentIndex(i);

        // --- Examiner speaks ---
        setState('examiner_speaking');

        // Switch to playback mode (VAD sets recording mode)
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });

        if (question.audioUrl) {
          await playAudio(question.audioUrl);
        } else {
          const audioPath = await textToSpeech({ text: question.questionText });
          await playAudio(audioPath);

          if (!question.id.startsWith('intro-')) {
            uploadToCache(question.id, level, part, audioPath).catch(() => {});
          }
        }

        if (!isRunningRef.current) return;

        appendTranscript({
          role: 'examiner',
          text: question.questionText,
          timestamp: new Date(),
        });

        // --- Candidate speaks ---
        setState('candidate_speaking');

        const answerText = await listenForAnswer();

        if (!isRunningRef.current) return;

        if (answerText) {
          appendTranscript({
            role: 'candidate',
            text: answerText,
            timestamp: new Date(),
          });
        }

        vadRef.current = null;
      }

      if (isRunningRef.current) {
        isRunningRef.current = false;
        setState('complete');
        onCompleteRef.current(transcriptRef.current);
      }
    },
    [appendTranscript, level, listenForAnswer, part]
  );

  const startExam = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setState('idle');
    setCurrentIndex(0);
    setTranscript([]);
    transcriptRef.current = [];

    runExamLoop(questions).catch((error) => {
      if (isRunningRef.current) {
        isRunningRef.current = false;
        setState('error');
        onErrorRef.current?.(error as Error);
      }
    });
  }, [questions, runExamLoop]);

  const stopExam = useCallback(async () => {
    isRunningRef.current = false;
    if (vadRef.current) {
      await vadRef.current.cancel();
      vadRef.current = null;
    }
    setState('idle');
  }, []);

  return {
    state,
    currentIndex,
    transcript,
    startExam,
    stopExam,
  };
}
