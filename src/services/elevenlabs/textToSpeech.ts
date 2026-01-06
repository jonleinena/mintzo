// ElevenLabs Text-to-Speech Service
// Used for examiner speech in Part 2 introduction and follow-up

import { Audio } from 'expo-av';
import type { TTSConfig, TTSRequest } from '@/types/voice';

const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';
const TTS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Default voice settings for examiner
const DEFAULT_CONFIG: TTSConfig = {
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // "Sarah" - professional female voice
  model: 'eleven_multilingual_v2',
  speed: 1.0,
};

interface TTSResponse {
  audioUri: string;
  durationMs: number;
}

export async function synthesizeSpeech(request: TTSRequest): Promise<TTSResponse> {
  const config = { ...DEFAULT_CONFIG, ...request.config };
  const { text } = request;

  try {
    const response = await fetch(`${TTS_API_URL}/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: config.model,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    // Get audio blob
    const audioBlob = await response.blob();

    // Create a temporary file URI
    // In React Native, we'd use FileSystem to save this
    // For now, create an object URL (web) or save to cache (native)
    const audioUri = URL.createObjectURL(audioBlob);

    // Estimate duration based on text length (~150 words per minute)
    const wordCount = text.split(/\s+/).length;
    const durationMs = (wordCount / 150) * 60 * 1000;

    return { audioUri, durationMs };
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw new Error(
      `Failed to synthesize speech: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Play audio from URI using expo-av
export async function playAudio(audioUri: string): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    await sound.playAsync();

    // Wait for playback to complete
    return new Promise((resolve, reject) => {
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          sound.unloadAsync();
          resolve();
        }
        if ('error' in status && status.error) {
          sound.unloadAsync();
          reject(new Error(status.error));
        }
      });
    });
  } catch (error) {
    console.error('Audio playback error:', error);
    throw error;
  }
}

// Synthesize and play speech in one call
export async function speakText(text: string, config?: Partial<TTSConfig>): Promise<void> {
  const { audioUri } = await synthesizeSpeech({ text, config });
  await playAudio(audioUri);
}

// Mock TTS for development (uses device TTS)
export async function mockSpeakText(text: string): Promise<void> {
  // In development, just simulate a delay based on text length
  const wordCount = text.split(/\s+/).length;
  const durationMs = (wordCount / 150) * 60 * 1000;
  await new Promise((resolve) => setTimeout(resolve, Math.min(durationMs, 5000)));
}
