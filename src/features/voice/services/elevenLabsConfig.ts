export const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? '';
export const API_BASE = 'https://api.elevenlabs.io/v1';

export function ensureElevenLabsKey(): void {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_ELEVENLABS_API_KEY');
  }
}
