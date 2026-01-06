// useConversationalAI hook
// Wraps ElevenLabs conversational agent for exam parts 1, 3, 4

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  ConversationState,
  ConversationTurn,
  ConversationSession,
  ConversationConfig,
} from '@/types/voice';
import type { ExamLevel, ExamPart, ExamContent } from '@/types/exam';
import {
  createConversationalAgent,
  ConversationalAgentService,
} from '@/services/elevenlabs/conversationalAgent';
import { getExaminerPrompt } from '@/constants/examinerPrompts';

interface UseConversationalAIOptions {
  level: ExamLevel;
  part: ExamPart;
  content: ExamContent;
  agentId?: string;
  useMock?: boolean;
}

interface UseConversationalAIReturn {
  // State
  state: ConversationState;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: ConversationTurn[];
  error: string | undefined;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<ConversationSession>;
  getFullTranscript: () => string;
  getDuration: () => number;
}

export function useConversationalAI(
  options: UseConversationalAIOptions
): UseConversationalAIReturn {
  const { level, part, content, agentId, useMock = false } = options;

  const [state, setState] = useState<ConversationState>({
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    currentTurn: 'idle',
    transcript: [],
    error: undefined,
  });

  const agentRef = useRef<ConversationalAgentService | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (agentRef.current && state.isConnected) {
        agentRef.current.disconnect();
      }
    };
  }, [state.isConnected]);

  const connect = useCallback(async () => {
    // Get examiner prompt for this part
    const examinerPrompt = getExaminerPrompt(level, part);
    if (!examinerPrompt) {
      setState((prev) => ({
        ...prev,
        error: `No examiner prompt available for ${part}`,
      }));
      return;
    }

    // Build system prompt with part content
    const systemPrompt =
      examinerPrompt.systemPrompt + '\n\n' + examinerPrompt.getPartPrompt(content);

    // Create agent configuration
    const config: ConversationConfig = {
      agentId: agentId || process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID || '',
      systemPrompt,
      level,
      part,
      content,
    };

    // Create agent (mock or real based on option)
    if (useMock) {
      const { createMockConversationalAgent } = await import(
        '@/services/elevenlabs/__mocks__/conversationalAgent'
      );
      agentRef.current = createMockConversationalAgent(
        config,
        {
          onConnect: () =>
            setState((prev) => ({ ...prev, isConnected: true, error: undefined })),
          onDisconnect: () =>
            setState((prev) => ({ ...prev, isConnected: false })),
          onAgentSpeaking: () =>
            setState((prev) => ({ ...prev, isSpeaking: true, isListening: false })),
          onUserSpeaking: () =>
            setState((prev) => ({ ...prev, isSpeaking: false, isListening: true })),
          onTranscriptUpdate: (transcript) =>
            setState((prev) => ({ ...prev, transcript })),
          onError: (error) =>
            setState((prev) => ({ ...prev, error: error.message })),
        },
        setState
      ) as unknown as ConversationalAgentService;
    } else {
      agentRef.current = createConversationalAgent(
        config,
        {
          onConnect: () =>
            setState((prev) => ({ ...prev, isConnected: true, error: undefined })),
          onDisconnect: () =>
            setState((prev) => ({ ...prev, isConnected: false })),
          onAgentSpeaking: () =>
            setState((prev) => ({ ...prev, isSpeaking: true, isListening: false })),
          onUserSpeaking: () =>
            setState((prev) => ({ ...prev, isSpeaking: false, isListening: true })),
          onTranscriptUpdate: (transcript) =>
            setState((prev) => ({ ...prev, transcript })),
          onError: (error) =>
            setState((prev) => ({ ...prev, error: error.message })),
        },
        setState
      );
    }

    // Connect to the agent
    try {
      await agentRef.current.connect();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to connect',
      }));
    }
  }, [level, part, content, agentId, useMock]);

  const disconnect = useCallback(async (): Promise<ConversationSession> => {
    if (!agentRef.current) {
      return {
        sessionId: '',
        startedAt: new Date(),
        duration: 0,
        transcript: [],
        fullTranscriptText: '',
      };
    }

    const session = await agentRef.current.disconnect();
    agentRef.current = null;
    return session;
  }, []);

  const getFullTranscript = useCallback((): string => {
    return agentRef.current?.getFullTranscriptText() || '';
  }, []);

  const getDuration = useCallback((): number => {
    return agentRef.current?.getDuration() || 0;
  }, []);

  return {
    state,
    isConnected: state.isConnected,
    isListening: state.isListening,
    isSpeaking: state.isSpeaking,
    transcript: state.transcript,
    error: state.error,
    connect,
    disconnect,
    getFullTranscript,
    getDuration,
  };
}
