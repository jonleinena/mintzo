import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useConversation } from '@elevenlabs/react-native';
import type { ExamLevel, ExamPart } from '@/types/exam';
import type { Role } from '@/types/elevenlabs';

interface UseConversationalAIProps {
  level: ExamLevel;
  part: ExamPart;
  collaborativeTaskContent?: string;
  onTranscriptUpdate?: (transcript: string, role: Role) => void;
  onSessionEnd?: (fullTranscript: string) => void;
}

interface ConversationMessage {
  role: Role;
  content: string;
  timestamp: Date;
}

const PART3_AGENT_IDS: Record<ExamLevel, string> = {
  B2: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID_B2_PART3 ?? '',
  C1: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C1_PART3 ?? '',
  C2: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID_C2_PART3 ?? '',
};

function getAgentId(level: ExamLevel, part: ExamPart): string {
  if (part !== 'part3') {
    throw new Error('Conversational AI is only supported for Part 3.');
  }

  const agentId = PART3_AGENT_IDS[level];
  if (!agentId) {
    throw new Error(`Missing ElevenLabs agent ID for ${level} Part 3.`);
  }

  return agentId;
}

export function useConversationalAI({
  level,
  part,
  collaborativeTaskContent,
  onTranscriptUpdate,
  onSessionEnd,
}: UseConversationalAIProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesRef = useRef<ConversationMessage[]>([]);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to conversation', conversationId);
      setSessionId(conversationId);
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected from conversation', details);
      const fullTranscript = messagesRef.current
        .map((message) => `${message.role}: ${message.content}`)
        .join('\n');
      onSessionEnd?.(fullTranscript);
    },
    onError: (message, context) => {
      console.error('❌ Conversation error:', message, context);
    },
    onMessage: ({ message, source }) => {
      const content = typeof message === 'string' ? message : JSON.stringify(message);
      const newMessage: ConversationMessage = {
        role: source as Role,
        content,
        timestamp: new Date(),
      };

      messagesRef.current = [...messagesRef.current, newMessage];
      setMessages(messagesRef.current);
      onTranscriptUpdate?.(newMessage.content, newMessage.role);
    },
    onModeChange: ({ mode }) => {
      console.log(`🔊 Mode: ${mode}`);
    },
    onStatusChange: ({ status }) => {
      console.log(`📡 Status: ${status}`);
    },
  });

  const startSession = useCallback(
    async (dynamicVariables: Record<string, string> = {}) => {
      if (isStarting) return;

      const agentId = getAgentId(level, part);
      setIsStarting(true);
      setMessages([]);
      messagesRef.current = [];

      try {
        await conversation.startSession({
          agentId,
          dynamicVariables: {
            platform: Platform.OS,
            examLevel: level,
            examPart: part,
            ...(collaborativeTaskContent ? { collaborativeTaskContent } : {}),
            ...dynamicVariables,
          },
        });
      } catch (error) {
        console.error('Failed to start conversation:', error);
        throw error;
      } finally {
        setIsStarting(false);
      }
    },
    [conversation, level, part, collaborativeTaskContent, isStarting]
  );

  const endSession = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  }, [conversation]);

  const sendTextMessage = useCallback(
    (text: string) => {
      if (conversation.status === 'connected') {
        conversation.sendUserMessage(text);
      }
    },
    [conversation]
  );

  const sendContextualUpdate = useCallback(
    (context: string) => {
      if (conversation.status === 'connected') {
        conversation.sendContextualUpdate(context);
      }
    },
    [conversation]
  );

  return {
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    isStarting,
    sessionId,
    messages,
    startSession,
    endSession,
    sendTextMessage,
    sendContextualUpdate,
    canStart: conversation.status === 'disconnected' && !isStarting,
    canEnd: conversation.status === 'connected',
    isConnected: conversation.status === 'connected',
  };
}
