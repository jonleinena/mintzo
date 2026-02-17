import { File } from 'expo-file-system';
import { ensureElevenLabsKey, ELEVENLABS_API_KEY, API_BASE } from './elevenLabsConfig';

export interface STTResult {
  text: string;
}

export async function speechToText(audioPath: string): Promise<STTResult> {
  ensureElevenLabsKey();

  const file = new File(audioPath);
  if (!file.exists) {
    throw new Error('Audio file not found');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: audioPath,
    type: 'audio/mp4',
    name: 'recording.m4a',
  } as any);
  formData.append('model_id', 'scribe_v2');

  const response = await fetch(`${API_BASE}/speech-to-text`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`STT request failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as { text?: string };
  return { text: data.text ?? '' };
}
