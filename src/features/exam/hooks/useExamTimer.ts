// useExamTimer hook
// Tracks exam part duration internally (not shown to user)

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseExamTimerOptions {
  targetDuration: number; // seconds
  onTimeWarning?: (remainingSeconds: number) => void;
  onTimeUp?: () => void;
  warningThreshold?: number; // seconds before target to trigger warning
}

interface UseExamTimerReturn {
  // State
  elapsedSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isOverTime: boolean;
  progress: number; // 0-1

  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => number; // Returns final elapsed time
}

export function useExamTimer(options: UseExamTimerOptions): UseExamTimerReturn {
  const { targetDuration, onTimeWarning, onTimeUp, warningThreshold = 30 } = options;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningFiredRef = useRef(false);
  const timeUpFiredRef = useRef(false);

  // Derived state
  const remainingSeconds = Math.max(0, targetDuration - elapsedSeconds);
  const isOverTime = elapsedSeconds > targetDuration;
  const progress = Math.min(1, elapsedSeconds / targetDuration);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer tick
  useEffect(() => {
    if (isRunning && startTimeRef.current !== null) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current!) / 1000) + pausedAtRef.current;
        setElapsedSeconds(elapsed);

        // Fire warning callback
        const remaining = targetDuration - elapsed;
        if (!warningFiredRef.current && remaining <= warningThreshold && remaining > 0) {
          warningFiredRef.current = true;
          onTimeWarning?.(remaining);
        }

        // Fire time up callback
        if (!timeUpFiredRef.current && elapsed >= targetDuration) {
          timeUpFiredRef.current = true;
          onTimeUp?.();
        }
      }, 100); // Update frequently for smooth progress

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, targetDuration, warningThreshold, onTimeWarning, onTimeUp]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
    warningFiredRef.current = false;
    timeUpFiredRef.current = false;
    setElapsedSeconds(0);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current !== null) {
      pausedAtRef.current = elapsedSeconds;
      setIsRunning(false);
    }
  }, [isRunning, elapsedSeconds]);

  const resume = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    warningFiredRef.current = false;
    timeUpFiredRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const stop = useCallback((): number => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return elapsedSeconds;
  }, [elapsedSeconds]);

  return {
    elapsedSeconds,
    remainingSeconds,
    isRunning,
    isOverTime,
    progress,
    start,
    pause,
    resume,
    reset,
    stop,
  };
}

// Format seconds to mm:ss (for internal use only)
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
