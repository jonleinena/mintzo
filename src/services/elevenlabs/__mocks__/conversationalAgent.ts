// Mock ElevenLabs Conversational AI Service for testing

import type {
  ConversationConfig,
  ConversationState,
  ConversationTurn,
  ConversationCallbacks,
  ConversationSession,
} from '@/types/voice';

// Sample examiner responses for different parts
const MOCK_EXAMINER_RESPONSES = {
  part1: [
    "Good morning! My name is Sarah and I'll be your examiner today. Can you tell me your full name, please?",
    "Thank you. Now, where are you from?",
    "That sounds interesting. What do you like most about living there?",
    "I see. Now, tell me about your hobbies. What do you enjoy doing in your free time?",
    "And what are your plans for the future?",
    "Thank you very much. That brings us to the end of Part 1.",
  ],
  part3: [
    "Now, I'd like you to discuss something together. Here are some ideas about how people can stay healthy. First, talk to each other about how effective these different ways are for staying healthy.",
    "That's a good point. What about exercise?",
    "Interesting perspective. Now, you have about a minute to decide which way is the most effective for staying healthy.",
    "Thank you. That brings us to the end of Part 3.",
  ],
  part4: [
    "Now I'd like to ask you some more questions about health and lifestyle.",
    "Do you think people today are more health-conscious than in the past?",
    "Why do you think some people find it difficult to maintain a healthy lifestyle?",
    "What role should governments play in promoting public health?",
    "Thank you very much. That's the end of the test.",
  ],
};

class MockConversationalAgentService {
  private state: ConversationState;
  private callbacks: ConversationCallbacks;
  private onStateChange?: (state: ConversationState) => void;
  private sessionStartTime?: Date;
  private currentResponseIndex = 0;
  private part: string;
  private autoRespond: boolean;

  constructor(
    config: ConversationConfig,
    callbacks?: ConversationCallbacks,
    onStateChange?: (state: ConversationState) => void,
    autoRespond = true
  ) {
    this.part = config.part;
    this.callbacks = callbacks || {};
    this.onStateChange = onStateChange;
    this.autoRespond = autoRespond;
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
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.sessionStartTime = new Date();
    this.currentResponseIndex = 0;

    this.updateState({ isConnected: true });
    this.callbacks.onConnect?.();

    // Start with first examiner prompt
    if (this.autoRespond) {
      await this.deliverExaminerResponse();
    }
  }

  private async deliverExaminerResponse(): Promise<void> {
    const responses = MOCK_EXAMINER_RESPONSES[this.part as keyof typeof MOCK_EXAMINER_RESPONSES] || MOCK_EXAMINER_RESPONSES.part1;

    if (this.currentResponseIndex >= responses.length) {
      return;
    }

    const response = responses[this.currentResponseIndex];

    // Simulate agent speaking
    this.updateState({ isSpeaking: true, currentTurn: 'agent' });
    this.callbacks.onAgentSpeaking?.(response);

    // Simulate speech duration (roughly 100ms per word)
    const duration = response.split(' ').length * 100;
    await new Promise((resolve) => setTimeout(resolve, duration));

    // Add to transcript
    this.addToTranscript({
      role: 'agent',
      text: response,
      timestamp: new Date(),
    });

    // Switch to listening mode
    this.updateState({ isSpeaking: false, isListening: true, currentTurn: 'user' });
    this.currentResponseIndex++;
  }

  // Simulate user speaking
  async simulateUserSpeech(text: string): Promise<void> {
    // Add user speech to transcript
    this.addToTranscript({
      role: 'user',
      text,
      timestamp: new Date(),
    });
    this.callbacks.onUserSpeaking?.(text);

    // Simulate processing and next response
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (this.autoRespond) {
      await this.deliverExaminerResponse();
    }
  }

  // Manual trigger for next examiner response
  async nextResponse(): Promise<void> {
    await this.deliverExaminerResponse();
  }

  async disconnect(): Promise<ConversationSession> {
    const endTime = new Date();
    const duration = this.sessionStartTime
      ? (endTime.getTime() - this.sessionStartTime.getTime()) / 1000
      : 0;

    const session: ConversationSession = {
      sessionId: `mock_session_${this.sessionStartTime?.getTime() || Date.now()}`,
      startedAt: this.sessionStartTime || new Date(),
      duration,
      transcript: this.state.transcript,
      fullTranscriptText: this.getFullTranscriptText(),
    };

    this.updateState(this.getInitialState());

    return session;
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

// Factory function
export function createMockConversationalAgent(
  config: ConversationConfig,
  callbacks?: ConversationCallbacks,
  onStateChange?: (state: ConversationState) => void,
  autoRespond = true
): MockConversationalAgentService {
  return new MockConversationalAgentService(config, callbacks, onStateChange, autoRespond);
}

// Jest mock setup
export const mockConnect = jest.fn();
export const mockDisconnect = jest.fn();
export const mockSimulateUserSpeech = jest.fn();

export { MockConversationalAgentService };
