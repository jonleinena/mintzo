// ElevenLabs Speech-to-Text Service
// Used for transcribing user recordings in Part 2 (Long Turn)

import type { STTResult, WordResult } from '@/types/scoring';

const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';
const STT_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

interface TranscriptionOptions {
  audioUri: string;
  language?: string;
  model?: string;
}

interface ElevenLabsSTTResponse {
  text: string;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  confidence?: number;
}

export async function transcribeAudio(options: TranscriptionOptions): Promise<STTResult> {
  const { audioUri, language = 'en', model = 'eleven_multilingual_v2' } = options;

  try {
    // Read the audio file and create form data
    const response = await fetch(audioUri);
    const audioBlob = await response.blob();

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.m4a');
    formData.append('model_id', model);
    formData.append('language_code', language);

    // Make API request to ElevenLabs STT
    const sttResponse = await fetch(STT_API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
      },
      body: formData,
    });

    if (!sttResponse.ok) {
      throw new Error(`STT API error: ${sttResponse.status}`);
    }

    const data: ElevenLabsSTTResponse = await sttResponse.json();

    // Transform response to our format
    const words: WordResult[] = (data.words || []).map((w) => ({
      word: w.word,
      start: w.start,
      end: w.end,
      confidence: w.confidence,
    }));

    // Calculate overall confidence and duration
    const overallConfidence =
      words.length > 0
        ? words.reduce((sum, w) => sum + w.confidence, 0) / words.length
        : data.confidence || 0.8;

    const duration = words.length > 0 ? words[words.length - 1].end : 0;

    return {
      transcript: data.text,
      words,
      confidence: overallConfidence,
      duration,
    };
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw new Error(
      `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Mock transcription for development/testing
export async function mockTranscribeAudio(
  _audioUri: string,
  mockTranscript?: string
): Promise<STTResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const transcript =
    mockTranscript ||
    `I think the two photographs show people in quite different situations.
    In the first photo, we can see a young woman reading a book in what looks like a cozy café.
    She seems very relaxed and absorbed in her book. The atmosphere looks quite peaceful.
    In the second photo, there's a group of people hiking in the mountains.
    They all look energetic and happy to be outdoors together.
    Both activities can be enjoyable, but in different ways.
    Reading is a solitary activity that helps you relax, while hiking is more social and active.
    I think the hikers might be enjoying their activity more because they seem to be sharing
    the experience with friends, which often makes activities more enjoyable.`;

  // Generate mock word confidences
  const words = transcript.split(/\s+/).map((word, index) => {
    const start = index * 0.4;
    // Most words have high confidence, some have lower
    const confidence = Math.random() > 0.85 ? 0.6 + Math.random() * 0.2 : 0.85 + Math.random() * 0.15;
    return {
      word: word.replace(/[.,!?]/g, ''),
      start,
      end: start + 0.35,
      confidence,
    };
  });

  const overallConfidence = words.reduce((sum, w) => sum + w.confidence, 0) / words.length;

  return {
    transcript,
    words,
    confidence: overallConfidence,
    duration: words.length * 0.4,
  };
}
