import { supabase } from '../supabase/client';

interface AgentSession {
  signedUrl: string;
  agentId: string;
  contentPrompt?: string;
  contentOptions?: string[];
  diagramMermaid?: string;
  decisionPrompt?: string;
}

export async function getAgentSession(level: string, part3ContentId: string): Promise<AgentSession> {
  const { data: { session } } = await supabase.auth.getSession();

  const { data, error } = await supabase.functions.invoke('voice-agent-session', {
    body: { level, part3ContentId },
    ...(session?.access_token && {
      headers: { Authorization: `Bearer ${session.access_token}` },
    }),
  });

  if (error) throw new Error(`Failed to get agent session: ${error.message}`);
  return data as AgentSession;
}

export async function gradeExam(sessionId: string, transcripts: Record<string, string>, level: string) {
  const { data: { session } } = await supabase.auth.getSession();

  const { data, error } = await supabase.functions.invoke('exam-grade', {
    body: { sessionId, transcripts, level },
    ...(session?.access_token && {
      headers: { Authorization: `Bearer ${session.access_token}` },
    }),
  });

  if (error) throw new Error(`Grading failed: ${error.message}`);
  return data;
}
