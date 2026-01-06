// useMonologueRecording hook
// Handles audio recording for Part 2 (Long Turn)

import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import type { MonologueState, MonologueResult } from '@/types/voice';
import type { STTResult } from '@/types/scoring';
import { transcribeAudio, mockTranscribeAudio } from '@/services/elevenlabs/speechToText';

interface UseMonologueRecordingOptions {
  targetDuration?: number; // seconds
  useMock?: boolean;
}

interface UseMonologueRecordingReturn {
  // State
  state: MonologueState;
  isRecording: boolean;
  duration: number;
  audioUri: string | null;
  error: string | undefined;

  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>; // Returns audio URI
  transcribe: () => Promise<STTResult | null>;
  reset: () => void;
}

export function useMonologueRecording(
  options: UseMonologueRecordingOptions = {}
): UseMonologueRecordingReturn {
  const { targetDuration = 60, useMock = false } = options;

  const [state, setState] = useState<MonologueState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioUri: undefined,
    error: undefined,
  });

  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setState((prev) => ({
          ...prev,
          error: 'Microphone permission not granted',
        }));
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;
      startTimeRef.current = Date.now();

      // Update duration every 100ms
      durationIntervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setState((prev) => ({ ...prev, duration: elapsed }));
        }
      }, 100);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioUri: undefined,
        error: undefined,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start recording',
      }));
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recordingRef.current) {
      return null;
    }

    try {
      // Stop duration tracking
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // Stop and unload recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      // Calculate final duration
      const finalDuration = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : state.duration;

      recordingRef.current = null;
      startTimeRef.current = null;

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      setState((prev) => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        duration: finalDuration,
        audioUri: uri || undefined,
      }));

      return uri || null;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isRecording: false,
        error: error instanceof Error ? error.message : 'Failed to stop recording',
      }));
      return null;
    }
  }, [state.duration]);

  const transcribe = useCallback(async (): Promise<STTResult | null> => {
    if (!state.audioUri) {
      setState((prev) => ({
        ...prev,
        error: 'No recording to transcribe',
      }));
      return null;
    }

    try {
      if (useMock) {
        return await mockTranscribeAudio(state.audioUri);
      }
      return await transcribeAudio({ audioUri: state.audioUri });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to transcribe',
      }));
      return null;
    }
  }, [state.audioUri, useMock]);

  const reset = useCallback(() => {
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    startTimeRef.current = null;

    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioUri: undefined,
      error: undefined,
    });
  }, []);

  return {
    state,
    isRecording: state.isRecording,
    duration: state.duration,
    audioUri: state.audioUri || null,
    error: state.error,
    startRecording,
    stopRecording,
    transcribe,
    reset,
  };
}
