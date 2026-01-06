// ElevenLabs Conversational AI Service
// Handles real-time voice conversations for Parts 1, 3, and 4

import type {
  ConversationConfig,
  ConversationState,
  ConversationTurn,
  ConversationCallbacks,
  ConversationSession,
} from '@/types/voice';

// Default configuration
const DEFAULT_AGENT_ID = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID || '';
const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';

interface ConversationAgentOptions {
  agentId?: string;
  systemPrompt: string;
  onStateChange?: (state: ConversationState) => void;
  callbacks?: ConversationCallbacks;
}

class ConversationalAgentService {
  private agentId: string;
  private systemPrompt: string;
  private state: ConversationState;
  private callbacks: ConversationCallbacks;
  private onStateChange?: (state: ConversationState) => void;
  private sessionStartTime?: Date;
  private conversationInstance: unknown = null;

  constructor(options: ConversationAgentOptions) {
    this.agentId = options.agentId || DEFAULT_AGENT_ID;
    this.systemPrompt = options.systemPrompt;
    this.onStateChange = options.onStateChange;
    this.callbacks = options.callbacks || {};
    this.state = this.getInitialState();
  }

  private getInitialState(): ConversationState {
    return {
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      currentTurn: 'idle',
      transcript: [],
      error: undefined,
    };
  }

  private updateState(updates: Partial<ConversationState>) {
    this.state = { ...this.state, ...updates };
    this.onStateChange?.(this.state);
  }

  private addToTranscript(turn: ConversationTurn) {
    const newTranscript = [...this.state.transcript, turn];
    this.updateState({ transcript: newTranscript });
    this.callbacks.onTranscriptUpdate?.(newTranscript);
    this.callbacks.onTurnComplete?.(turn);
  }

  async connect(): Promise<void> {
    try {
      // Dynamically import the ElevenLabs SDK to avoid SSR issues
      const { Conversation } = await import('@11labs/react');

      this.sessionStartTime = new Date();

      // Create conversation instance with ElevenLabs
      // Note: The actual implementation will depend on the SDK version
      // This is a placeholder showing the expected interface
      this.conversationInstance = await Conversation.startSession({
        agentId: this.agentId,
        overrides: {
          agent: {
            prompt: {
              prompt: this.systemPrompt,
            },
          },
        },
        onConnect: () => {
          this.updateState({ isConnected: true, currentTurn: 'idle' });
          this.callbacks.onConnect?.();
        },
        onDisconnect: () => {
          this.updateState({ isConnected: false, currentTurn: 'idle' });
          this.callbacks.onDisconnect?.();
        },
        onMessage: (message: { source: string; message: string }) => {
          if (message.source === 'agent') {
            const turn: ConversationTurn = {
              role: 'agent',
              text: message.message,
              timestamp: new Date(),
            };
            this.addToTranscript(turn);
            this.callbacks.onAgentSpeaking?.(message.message);
          }
        },
        onModeChange: (mode: { mode: string }) => {
          if (mode.mode === 'speaking') {
            this.updateState({ isSpeaking: true, isListening: false, currentTurn: 'agent' });
          } else if (mode.mode === 'listening') {
            this.updateState({ isSpeaking: false, isListening: true, currentTurn: 'user' });
          } else {
            this.updateState({ isSpeaking: false, isListening: false, currentTurn: 'idle' });
          }
        },
        onError: (error: Error) => {
          this.updateState({ error: error.message });
          this.callbacks.onError?.(error);
        },
      });

      this.updateState({ isConnected: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      this.updateState({ error: errorMessage });
      this.callbacks.onError?.(new Error(errorMessage));
      throw error;
    }
  }

  async disconnect(): Promise<ConversationSession> {
    const endTime = new Date();
    const duration = this.sessionStartTime
      ? (endTime.getTime() - this.sessionStartTime.getTime()) / 1000
      : 0;

    // End the ElevenLabs session
    if (this.conversationInstance && typeof (this.conversationInstance as { endSession?: () => Promise<void> }).endSession === 'function') {
      await (this.conversationInstance as { endSession: () => Promise<void> }).endSession();
    }

    const session: ConversationSession = {
      sessionId: `session_${this.sessionStartTime?.getTime() || Date.now()}`,
      startedAt: this.sessionStartTime || new Date(),
      duration,
      transcript: this.state.transcript,
      fullTranscriptText: this.getFullTranscriptText(),
    };

    this.updateState(this.getInitialState());
    this.conversationInstance = null;
    this.sessionStartTime = undefined;

    return session;
  }

  // Add user speech to transcript (for manual tracking if needed)
  addUserSpeech(text: string) {
    const turn: ConversationTurn = {
      role: 'user',
      text,
      timestamp: new Date(),
    };
    this.addToTranscript(turn);
    this.callbacks.onUserSpeaking?.(text);
  }

  getState(): ConversationState {
    return this.state;
  }

  getTranscript(): ConversationTurn[] {
    return this.state.transcript;
  }

  getFullTranscriptText(): string {
    return this.state.transcript
      .map((turn) => `${turn.role === 'agent' ? 'Examiner' : 'Candidate'}: ${turn.text}`)
      .join('\n\n');
  }

  getDuration(): number {
    if (!this.sessionStartTime) return 0;
    return (Date.now() - this.sessionStartTime.getTime()) / 1000;
  }
}

// Factory function to create agent service
export function createConversationalAgent(
  config: ConversationConfig,
  callbacks?: ConversationCallbacks,
  onStateChange?: (state: ConversationState) => void
): ConversationalAgentService {
  return new ConversationalAgentService({
    agentId: config.agentId,
    systemPrompt: config.systemPrompt,
    callbacks,
    onStateChange,
  });
}

export { ConversationalAgentService };
