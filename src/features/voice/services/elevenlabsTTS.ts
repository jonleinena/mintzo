import { Audio } from 'expo-av';
import { File, Paths } from 'expo-file-system';
import { supabase } from '@/services/supabase/client';
import type { ExamLevel, ExamPart } from '@/types/exam';
import { ensureElevenLabsKey, ELEVENLABS_API_KEY, API_BASE } from './elevenLabsConfig';

interface VoiceSettings {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  voiceSettings?: VoiceSettings;
}

const FALLBACK_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const DEFAULT_VOICE_ID = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID || FALLBACK_VOICE_ID;

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.4,
  similarity_boost: 0.75,
  style: 0.3,
  use_speaker_boost: true,
};

const PLAYBACK_TIMEOUT_MS = 30000;

function arrayBufferToBase64(input: ArrayBuffer): string {
  const bytes = new Uint8Array(input);
  const chunkSize = 0x8000;
  let binary = '';

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export async function textToSpeech({
  text,
  voiceId = DEFAULT_VOICE_ID,
  modelId = 'eleven_multilingual_v2',
  voiceSettings = DEFAULT_VOICE_SETTINGS,
}: TextToSpeechOptions): Promise<string> {
  ensureElevenLabsKey();

  const response = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: voiceSettings,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS request failed: ${response.status}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const audioBase64 = arrayBufferToBase64(audioBuffer);
  const file = new File(Paths.cache, `tts_${Date.now()}.mp3`);
  file.write(audioBase64, { encoding: 'base64' });

  return file.uri;
}

export async function playAudio(uri: string): Promise<void> {
  const { sound } = await Audio.Sound.createAsync({ uri });

  try {
    await sound.playAsync();

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        sound.setOnPlaybackStatusUpdate(null);
        reject(new Error('Audio playback timed out'));
      }, PLAYBACK_TIMEOUT_MS);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          clearTimeout(timeout);
          sound.setOnPlaybackStatusUpdate(null);
          reject(new Error('Audio failed to load during playback'));
          return;
        }
        if (status.didJustFinish) {
          clearTimeout(timeout);
          sound.setOnPlaybackStatusUpdate(null);
          resolve();
        }
      });
    });
  } finally {
    await sound.unloadAsync();
  }
}

export async function uploadToCache(
  questionId: string,
  level: ExamLevel,
  part: ExamPart,
  localAudioPath: string
): Promise<string | null> {
  try {
    // Ensure we have a valid session before calling the edge function
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      console.warn('Cache upload skipped: no active session');
      return null;
    }

    const file = new File(localAudioPath);
    const base64Audio = await file.base64();

    const { data, error } = await supabase.functions.invoke('cache-audio', {
      body: {
        questionId,
        level,
        part,
        audioBase64: base64Audio,
      },
    });

    if (error) {
      console.warn('Audio cache upload failed:', error);
      return null;
    }

    return data?.url ?? null;
  } catch (error) {
    console.warn('Cache upload error:', error);
    return null;
  }
}
