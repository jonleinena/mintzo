// useExamSession hook
// Manages exam session state and flow

import { useState, useCallback, useRef } from 'react';
import type {
  ExamLevel,
  ExamPart,
  ExamSession,
  ExamPartResult,
  ExamContent,
  SessionStatus,
} from '@/types/exam';
import { PART_ORDER, getNextPart, isLastPart, getPartConfig } from '@/constants/examConfig';

interface UseExamSessionOptions {
  level: ExamLevel;
  isFreeTrial?: boolean;
  userId?: string;
}

interface UseExamSessionReturn {
  session: ExamSession | null;
  currentPart: ExamPart | null;
  currentPartConfig: ReturnType<typeof getPartConfig> | null;
  isSessionActive: boolean;
  isComplete: boolean;

  // Actions
  startSession: (content?: Record<ExamPart, ExamContent>) => void;
  completeCurrentPart: (result: Omit<ExamPartResult, 'partId' | 'part' | 'completedAt'>) => void;
  skipToNextPart: () => void;
  abandonSession: () => void;
  getSessionResults: () => ExamPartResult[];
}

export function useExamSession(options: UseExamSessionOptions): UseExamSessionReturn {
  const { level, isFreeTrial = false, userId = 'anonymous' } = options;

  const [session, setSession] = useState<ExamSession | null>(null);
  const contentRef = useRef<Record<ExamPart, ExamContent> | null>(null);

  // Derived state
  const currentPart = session?.currentPart ?? null;
  const currentPartConfig = currentPart ? getPartConfig(level, currentPart) : null;
  const isSessionActive = session?.status === 'in_progress';
  const isComplete = session?.status === 'completed';

  // Start a new exam session
  const startSession = useCallback(
    (content?: Record<ExamPart, ExamContent>) => {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const firstPart = PART_ORDER[level][0];

      contentRef.current = content ?? null;

      setSession({
        id: sessionId,
        userId,
        level,
        sessionType: 'full_exam',
        currentPart: firstPart,
        partsCompleted: [],
        status: 'in_progress',
        isFreeTrial,
        startedAt: new Date(),
        partResults: [],
      });
    },
    [level, isFreeTrial, userId]
  );

  // Complete the current part and move to next
  const completeCurrentPart = useCallback(
    (result: Omit<ExamPartResult, 'partId' | 'part' | 'completedAt'>) => {
      if (!session || !currentPart) return;

      const partResult: ExamPartResult = {
        ...result,
        partId: `${session.id}_${currentPart}`,
        part: currentPart,
        completedAt: new Date(),
      };

      const nextPart = getNextPart(level, currentPart);
      const isLast = isLastPart(level, currentPart);

      setSession((prev) => {
        if (!prev) return prev;

        const newSession: ExamSession = {
          ...prev,
          partsCompleted: [...prev.partsCompleted, currentPart],
          partResults: [...prev.partResults, partResult],
          currentPart: isLast ? currentPart : nextPart!,
          status: isLast ? 'completed' : 'in_progress',
          completedAt: isLast ? new Date() : undefined,
        };

        return newSession;
      });
    },
    [session, currentPart, level]
  );

  // Skip to next part without completing current
  const skipToNextPart = useCallback(() => {
    if (!session || !currentPart) return;

    const nextPart = getNextPart(level, currentPart);

    if (nextPart) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              currentPart: nextPart,
            }
          : prev
      );
    }
  }, [session, currentPart, level]);

  // Abandon the session
  const abandonSession = useCallback(() => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            status: 'abandoned',
            completedAt: new Date(),
          }
        : prev
    );
  }, []);

  // Get all results
  const getSessionResults = useCallback((): ExamPartResult[] => {
    return session?.partResults ?? [];
  }, [session]);

  return {
    session,
    currentPart,
    currentPartConfig,
    isSessionActive,
    isComplete,
    startSession,
    completeCurrentPart,
    skipToNextPart,
    abandonSession,
    getSessionResults,
  };
}
