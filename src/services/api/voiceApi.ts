import * as FileSystem from 'expo-file-system';
import { supabase } from '../supabase/client';

const FUNCTIONS_URL = process.env.EXPO_PUBLIC_SUPABASE_URL + '/functions/v1';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token ?? ''}`,
  };
}

export async function textToSpeech(text: string): Promise<string> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${FUNCTIONS_URL}/voice-tts`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`TTS failed: ${response.status}`);
  }

  const { audio } = await response.json();

  const audioPath = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`;
  await FileSystem.writeAsStringAsync(audioPath, audio, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return audioPath;
}

export async function speechToText(audioUri: string): Promise<{ text: string; words?: Array<{ word: string; start: number; end: number; confidence: number }> }> {
  const headers = await getAuthHeaders();

  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as any);

  const response = await fetch(`${FUNCTIONS_URL}/voice-stt`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`STT failed: ${response.status}`);
  }

  return response.json();
}

export async function getAgentSession(level: string, part3ContentId: string): Promise<{ signedUrl: string; agentId: string; contentPrompt?: string; contentOptions?: string[] }> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${FUNCTIONS_URL}/voice-agent-session`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, part3ContentId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get agent session: ${response.status}`);
  }

  return response.json();
}

export async function fetchExamContent(level: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${FUNCTIONS_URL}/exam-content`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ level }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch exam content: ${response.status}`);
  }

  return response.json();
}

export async function gradeExam(sessionId: string, transcripts: Record<string, string>, level: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${FUNCTIONS_URL}/exam-grade`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, transcripts, level }),
  });

  if (!response.ok) {
    throw new Error(`Grading failed: ${response.status}`);
  }

  return response.json();
}
