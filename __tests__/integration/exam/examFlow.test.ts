// Integration tests for exam flow
// Tests the complete flow from session start to results

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useExamSession } from '@/features/exam/hooks/useExamSession';
import { useExamTimer } from '@/features/exam/hooks/useExamTimer';

// Mock the timer for controlled testing
jest.useFakeTimers();

describe('Exam Flow Integration', () => {
  describe('useExamSession', () => {
    it('should initialize session with first part', () => {
      const { result } = renderHook(() =>
        useExamSession({ level: 'B2', isFreeTrial: false })
      );

      act(() => {
        result.current.startSession();
      });

      expect(result.current.session).not.toBeNull();
      expect(result.current.currentPart).toBe('part1');
      expect(result.current.isSessionActive).toBe(true);
      expect(result.current.isComplete).toBe(false);
    });

    it('should progress through all parts', () => {
      const { result } = renderHook(() =>
        useExamSession({ level: 'B2', isFreeTrial: false })
      );

      act(() => {
        result.current.startSession();
      });

      // Complete Part 1
      act(() => {
        result.current.completeCurrentPart({
          content: { type: 'part1', questions: [] },
          userTranscript: 'Test transcript',
          durationSeconds: 120,
          targetDurationSeconds: 120,
          scores: {
            grammar: 4.0,
            vocabulary: 4.0,
            discourse: 4.0,
            pronunciation: 4.0,
            interaction: 4.0,
            globalAchievement: 4.0,
          },
          feedback: {
            summary: '',
            strengths: [],
            improvements: [],
            grammarErrors: [],
            vocabularyNotes: [],
            pronunciationFlags: [],
            examplePhrases: [],
          },
        });
      });

      expect(result.current.currentPart).toBe('part2');
      expect(result.current.session?.partsCompleted).toContain('part1');

      // Complete Part 2
      act(() => {
        result.current.completeCurrentPart({
          content: { type: 'part2', images: [], prompt: '', followUpQuestion: '' },
          userTranscript: 'Test transcript',
          durationSeconds: 60,
          targetDurationSeconds: 60,
          scores: {
            grammar: 4.0,
            vocabulary: 4.0,
            discourse: 4.0,
            pronunciation: 4.0,
            interaction: 4.0,
            globalAchievement: 4.0,
          },
          feedback: {
            summary: '',
            strengths: [],
            improvements: [],
            grammarErrors: [],
            vocabularyNotes: [],
            pronunciationFlags: [],
            examplePhrases: [],
          },
        });
      });

      expect(result.current.currentPart).toBe('part3');

      // Complete Part 3
      act(() => {
        result.current.completeCurrentPart({
          content: { type: 'part3', prompt: '', options: [], centralQuestion: '' },
          userTranscript: 'Test transcript',
          durationSeconds: 180,
          targetDurationSeconds: 180,
          scores: {
            grammar: 4.0,
            vocabulary: 4.0,
            discourse: 4.0,
            pronunciation: 4.0,
            interaction: 4.0,
            globalAchievement: 4.0,
          },
          feedback: {
            summary: '',
            strengths: [],
            improvements: [],
            grammarErrors: [],
            vocabularyNotes: [],
            pronunciationFlags: [],
            examplePhrases: [],
          },
        });
      });

      expect(result.current.currentPart).toBe('part4');

      // Complete Part 4
      act(() => {
        result.current.completeCurrentPart({
          content: { type: 'part4', topic: '', questions: [] },
          userTranscript: 'Test transcript',
          durationSeconds: 240,
          targetDurationSeconds: 240,
          scores: {
            grammar: 4.0,
            vocabulary: 4.0,
            discourse: 4.0,
            pronunciation: 4.0,
            interaction: 4.0,
            globalAchievement: 4.0,
          },
          feedback: {
            summary: '',
            strengths: [],
            improvements: [],
            grammarErrors: [],
            vocabularyNotes: [],
            pronunciationFlags: [],
            examplePhrases: [],
          },
        });
      });

      expect(result.current.isComplete).toBe(true);
      expect(result.current.session?.status).toBe('completed');
      expect(result.current.session?.partResults).toHaveLength(4);
    });

    it('should handle session abandonment', () => {
      const { result } = renderHook(() =>
        useExamSession({ level: 'B2', isFreeTrial: false })
      );

      act(() => {
        result.current.startSession();
      });

      act(() => {
        result.current.abandonSession();
      });

      expect(result.current.session?.status).toBe('abandoned');
    });

    it('should handle C2 level with 3 parts', () => {
      const { result } = renderHook(() =>
        useExamSession({ level: 'C2', isFreeTrial: false })
      );

      act(() => {
        result.current.startSession();
      });

      expect(result.current.currentPart).toBe('part1');

      // Complete all 3 C2 parts
      ['part1', 'part2', 'part3'].forEach((_, index) => {
        act(() => {
          result.current.completeCurrentPart({
            content: { type: 'part1', questions: [] },
            userTranscript: 'Test',
            durationSeconds: 120,
            targetDurationSeconds: 120,
            scores: {
              grammar: 4.0,
              vocabulary: 4.0,
              discourse: 4.0,
              pronunciation: 4.0,
              interaction: 4.0,
              globalAchievement: 4.0,
            },
            feedback: {
              summary: '',
              strengths: [],
              improvements: [],
              grammarErrors: [],
              vocabularyNotes: [],
              pronunciationFlags: [],
              examplePhrases: [],
            },
          });
        });
      });

      expect(result.current.isComplete).toBe(true);
      expect(result.current.session?.partResults).toHaveLength(3);
    });

    it('should handle free trial flag', () => {
      const { result } = renderHook(() =>
        useExamSession({ level: 'B2', isFreeTrial: true })
      );

      act(() => {
        result.current.startSession();
      });

      expect(result.current.session?.isFreeTrial).toBe(true);
    });
  });

  describe('useExamTimer', () => {
    beforeEach(() => {
      jest.clearAllTimers();
    });

    it('should start and track time', () => {
      const { result } = renderHook(() =>
        useExamTimer({ targetDuration: 120 })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.elapsedSeconds).toBe(0);

      // Advance time by 10 seconds
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(9);
      expect(result.current.remainingSeconds).toBeLessThanOrEqual(111);
    });

    it('should call onTimeWarning when approaching target', () => {
      const onTimeWarning = jest.fn();

      const { result } = renderHook(() =>
        useExamTimer({
          targetDuration: 60,
          warningThreshold: 30,
          onTimeWarning,
        })
      );

      act(() => {
        result.current.start();
      });

      // Advance to trigger warning (at 30 seconds remaining)
      act(() => {
        jest.advanceTimersByTime(31000);
      });

      expect(onTimeWarning).toHaveBeenCalled();
    });

    it('should call onTimeUp when target reached', () => {
      const onTimeUp = jest.fn();

      const { result } = renderHook(() =>
        useExamTimer({
          targetDuration: 5,
          onTimeUp,
        })
      );

      act(() => {
        result.current.start();
      });

      // Advance past target
      act(() => {
        jest.advanceTimersByTime(6000);
      });

      expect(onTimeUp).toHaveBeenCalled();
      expect(result.current.isOverTime).toBe(true);
    });

    it('should pause and resume correctly', () => {
      const { result } = renderHook(() =>
        useExamTimer({ targetDuration: 120 })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      const elapsedBeforePause = result.current.elapsedSeconds;

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);

      // Advance time while paused
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Time should not have increased
      expect(result.current.elapsedSeconds).toBe(elapsedBeforePause);

      act(() => {
        result.current.resume();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedSeconds).toBeGreaterThan(elapsedBeforePause);
    });

    it('should reset timer correctly', () => {
      const { result } = renderHook(() =>
        useExamTimer({ targetDuration: 120 })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.isRunning).toBe(false);
    });

    it('should return elapsed time on stop', () => {
      const { result } = renderHook(() =>
        useExamTimer({ targetDuration: 120 })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(30000);
      });

      let finalTime: number = 0;
      act(() => {
        finalTime = result.current.stop();
      });

      expect(finalTime).toBeGreaterThanOrEqual(29);
      expect(result.current.isRunning).toBe(false);
    });

    it('should calculate progress correctly', () => {
      const { result } = renderHook(() =>
        useExamTimer({ targetDuration: 100 })
      );

      act(() => {
        result.current.start();
      });

      // At 50 seconds, progress should be 0.5
      act(() => {
        jest.advanceTimersByTime(50000);
      });

      expect(result.current.progress).toBeCloseTo(0.5, 1);
    });
  });

  describe('Complete Exam Flow', () => {
    it('should handle complete exam flow from start to results', async () => {
      const sessionHook = renderHook(() =>
        useExamSession({ level: 'B2', isFreeTrial: false })
      );

      // Start session
      act(() => {
        sessionHook.result.current.startSession();
      });

      expect(sessionHook.result.current.session).not.toBeNull();
      expect(sessionHook.result.current.currentPart).toBe('part1');

      // For each part
      const parts = ['part1', 'part2', 'part3', 'part4'] as const;

      for (let i = 0; i < parts.length; i++) {
        const timerHook = renderHook(() =>
          useExamTimer({ targetDuration: 120 })
        );

        // Start timer
        act(() => {
          timerHook.result.current.start();
        });

        // Simulate some time passing
        act(() => {
          jest.advanceTimersByTime(30000);
        });

        // Stop timer and get duration
        let duration: number = 0;
        act(() => {
          duration = timerHook.result.current.stop();
        });

        // Complete the part
        act(() => {
          sessionHook.result.current.completeCurrentPart({
            content: { type: 'part1', questions: [] },
            userTranscript: `Transcript for ${parts[i]}`,
            durationSeconds: duration,
            targetDurationSeconds: 120,
            scores: {
              grammar: 3.5 + (i * 0.1),
              vocabulary: 3.5 + (i * 0.1),
              discourse: 3.5 + (i * 0.1),
              pronunciation: 3.5,
              interaction: 4.0,
              globalAchievement: 3.5,
            },
            feedback: {
              summary: `Feedback for ${parts[i]}`,
              strengths: ['Good point'],
              improvements: ['Improve this'],
              grammarErrors: [],
              vocabularyNotes: [],
              pronunciationFlags: [],
              examplePhrases: [],
            },
          });
        });
      }

      // Verify final state
      expect(sessionHook.result.current.isComplete).toBe(true);
      expect(sessionHook.result.current.session?.status).toBe('completed');

      const results = sessionHook.result.current.getSessionResults();
      expect(results).toHaveLength(4);
      expect(results[0].userTranscript).toBe('Transcript for part1');
      expect(results[3].userTranscript).toBe('Transcript for part4');
    });
  });
});
