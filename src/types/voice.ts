// Voice types for ElevenLabs integration

import type { ExamLevel, ExamPart, ExamContent } from './exam';

// Conversational AI types
export interface ConversationConfig {
  agentId: string;
  systemPrompt: string;
  level: ExamLevel;
  part: ExamPart;
  content: ExamContent;
}

export interface ConversationState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  currentTurn: 'user' | 'agent' | 'idle';
  transcript: ConversationTurn[];
  error?: string;
}

export interface ConversationTurn {
  role: 'user' | 'agent';
  text: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface ConversationCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onAgentSpeaking?: (text: string) => void;
  onUserSpeaking?: (text: string) => void;
  onTurnComplete?: (turn: ConversationTurn) => void;
  onError?: (error: Error) => void;
  onTranscriptUpdate?: (transcript: ConversationTurn[]) => void;
}

// Monologue recording types (for Part 2)
export interface MonologueConfig {
  level: ExamLevel;
  prompt: string;
  targetDuration: number; // seconds
  images: string[];
}

export interface MonologueState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // Current recording duration
  audioUri?: string;
  error?: string;
}

export interface MonologueResult {
  audioUri: string;
  duration: number;
  transcript: string;
  wordConfidences: WordConfidence[];
}

export interface WordConfidence {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

// TTS (Text-to-Speech) types
export interface TTSConfig {
  voiceId: string;
  model?: string;
  speed?: number;
}

export interface TTSRequest {
  text: string;
  config?: Partial<TTSConfig>;
}

// ElevenLabs agent configuration
export interface AgentConfig {
  agentId: string;
  apiKey: string;
  language?: string;
  voiceSettings?: {
    stability?: number;
    similarity?: number;
    style?: number;
  };
}

// Audio levels for visualization
export interface AudioLevel {
  timestamp: number;
  level: number; // 0-1
}

// Conversation session info
export interface ConversationSession {
  sessionId: string;
  startedAt: Date;
  duration: number;
  transcript: ConversationTurn[];
  fullTranscriptText: string;
}
