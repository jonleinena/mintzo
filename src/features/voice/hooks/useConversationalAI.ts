import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useConversation } from '@elevenlabs/react-native';
import type { ExamLevel, ExamPart } from '@/types/exam';
import type { Role } from '@/types/elevenlabs';
import { getAgentSession } from '@/services/api/voiceApi';

interface UseConversationalAIProps {
  level: ExamLevel;
  part: ExamPart;
  collaborativeTaskContent?: string;
  part3ContentId?: string;
  onTranscriptUpdate?: (transcript: string, role: Role) => void;
  onSessionEnd?: (fullTranscript: string) => void;
}

interface ConversationMessage {
  role: Role;
  content: string;
  timestamp: Date;
}

export function useConversationalAI({
  level,
  part,
  collaborativeTaskContent,
  part3ContentId,
  onTranscriptUpdate,
  onSessionEnd,
}: UseConversationalAIProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [diagramMermaid, setDiagramMermaid] = useState<string | undefined>();
  const [contentOptions, setContentOptions] = useState<string[] | undefined>();
  const messagesRef = useRef<ConversationMessage[]>([]);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      setSessionId(conversationId);
    },
    onDisconnect: () => {
      const fullTranscript = messagesRef.current
        .map((message) => `${message.role}: ${message.content}`)
        .join('\n');
      onSessionEnd?.(fullTranscript);
    },
    onError: (message, context) => {
      console.error('Conversation error:', message, context);
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
    onModeChange: () => {},
    onStatusChange: () => {},
  });

  const startSession = useCallback(
    async (dynamicVariables: Record<string, string> = {}) => {
      if (isStarting) return;
      if (part !== 'part3') {
        throw new Error('Conversational AI is only supported for Part 3.');
      }

      setIsStarting(true);
      setMessages([]);
      messagesRef.current = [];

      try {
        // Get signed URL and content from edge function
        const agentSession = await getAgentSession(level, part3ContentId ?? '');

        setDiagramMermaid(agentSession.diagramMermaid);
        setContentOptions(agentSession.contentOptions);

        const sessionConfig = {
          signedUrl: agentSession.signedUrl,
          dynamicVariables: Object.fromEntries(
            Object.entries({
              platform: Platform.OS,
              examLevel: level,
              examPart: part,
              collaborativeTaskContent: collaborativeTaskContent ?? agentSession.contentPrompt,
              diagramText: agentSession.diagramMermaid,
              optionsList: agentSession.contentOptions ? JSON.stringify(agentSession.contentOptions) : undefined,
              decisionPrompt: agentSession.decisionPrompt,
              ...dynamicVariables,
            }).filter(([, v]) => v !== undefined),
          ),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ElevenLabs SDK accepts signedUrl but types don't expose it
        await conversation.startSession(sessionConfig as any);
      } catch (error) {
        console.error('Failed to start conversation:', error);
        throw error;
      } finally {
        setIsStarting(false);
      }
    },
    [conversation, level, part, collaborativeTaskContent, part3ContentId, isStarting]
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
    diagramMermaid,
    contentOptions,
    startSession,
    endSession,
    sendTextMessage,
    sendContextualUpdate,
    canStart: conversation.status === 'disconnected' && !isStarting,
    canEnd: conversation.status === 'connected',
    isConnected: conversation.status === 'connected',
  };
}
