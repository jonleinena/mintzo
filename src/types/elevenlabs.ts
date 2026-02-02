export type ConversationStatus = 'disconnected' | 'connecting' | 'connected';

export type Role = 'user' | 'assistant';

export type ConversationEvent = string | Record<string, unknown>;

export interface ConversationCallbacks {
  onConnect?: (data: { conversationId: string }) => void;
  onDisconnect?: (details?: string) => void;
  onError?: (message: string, context?: Record<string, unknown>) => void;
  onMessage?: (data: { message: ConversationEvent; source: Role }) => void;
  onModeChange?: (data: { mode: 'speaking' | 'listening' }) => void;
  onStatusChange?: (data: { status: ConversationStatus }) => void;
  onCanSendFeedbackChange?: (data: { canSendFeedback: boolean }) => void;
}

export interface SessionConfig {
  agentId: string;
  dynamicVariables?: Record<string, string>;
}
