import { File } from 'expo-file-system';

const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? '';
const API_BASE = 'https://api.elevenlabs.io/v1';

export interface STTWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface STTResult {
  text: string;
  words?: STTWord[];
}

function ensureConfig() {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_ELEVENLABS_API_KEY');
  }
}

export async function speechToText(audioPath: string): Promise<STTResult> {
  ensureConfig();

  const file = new File(audioPath);
  if (!file.exists) {
    throw new Error('Audio file not found');
  }

  const formData = new FormData();
  formData.append('audio', {
    uri: audioPath,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as any);

  const response = await fetch(`${API_BASE}/speech-to-text`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`STT request failed: ${response.status}`);
  }

  const data = (await response.json()) as STTResult;
  return {
    text: data.text ?? '',
    words: data.words,
  };
}
