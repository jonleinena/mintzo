import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [sessionToken, setSessionToken] = useState(0);
  const transcriptRef = useRef<ConversationTurn[]>([]);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const isRunningRef = useRef(false);

  const appendTranscript = useCallback((turn: ConversationTurn) => {
    transcriptRef.current = [...transcriptRef.current, turn];
    setTranscript(transcriptRef.current);
  }, []);

  const finishExam = useCallback(() => {
    setState('complete');
    onComplete(transcriptRef.current);
  }, [onComplete]);

  const askQuestion = useCallback(
    async (question: ScriptedQuestion) => {
      setState('examiner_speaking');

      try {
        if (question.audioUrl) {
          await playAudio(question.audioUrl);
        } else {
          const audioPath = await textToSpeech({ text: question.questionText });
          await playAudio(audioPath);

          uploadToCache(question.id, level, part, audioPath).then((url) => {
            if (url) {
              console.log('Cached audio URL:', url);
            }
          });
        }

        appendTranscript({
          role: 'examiner',
          text: question.questionText,
          timestamp: new Date(),
        });

        setState('candidate_speaking');

        vadRef.current = new VoiceActivityDetector({
          onSpeechEnd: async (audioUri) => {
            try {
              const result = await speechToText(audioUri);
              appendTranscript({
                role: 'candidate',
                text: result.text,
                timestamp: new Date(),
              });

              setCurrentIndex((prev) => prev + 1);
            } catch (error) {
              setState('error');
              onError?.(error as Error);
            }
          },
        });

        await vadRef.current.start();
      } catch (error) {
        setState('error');
        onError?.(error as Error);
      }
    },
    [appendTranscript, level, onError, part]
  );

  useEffect(() => {
    if (!isRunningRef.current) return;

    if (currentIndex >= questions.length) {
      finishExam();
      return;
    }

    askQuestion(questions[currentIndex]);
  }, [askQuestion, currentIndex, finishExam, questions, sessionToken]);

  const startExam = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setState('idle');
    setCurrentIndex(0);
    setTranscript([]);
    transcriptRef.current = [];
    setSessionToken((prev) => prev + 1);
  }, []);

  const stopExam = useCallback(async () => {
    isRunningRef.current = false;
    await vadRef.current?.cancel();
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
