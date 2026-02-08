import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, getUserId } from '../_shared/supabase.ts';

interface TTSRequest {
  text: string;
  voiceId?: string;
  modelId?: string;
}

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);
    const userId = await getUserId(supabase);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Parse request
    const { text, voiceId, modelId } = await req.json() as TTSRequest;

    if (!text || text.trim().length === 0) {
      return errorResponse('Text is required');
    }

    // Get API key
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      return errorResponse('ElevenLabs API key not configured', 500);
    }

    // Use default voice if not specified
    const voice = voiceId ?? Deno.env.get('ELEVENLABS_VOICE_ID') ?? 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice
    const model = modelId ?? 'eleven_turbo_v2_5';

    // Call ElevenLabs TTS API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voice}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS error:', errorText);
      return errorResponse(`TTS failed: ${response.status}`, 500);
    }

    // Get audio as ArrayBuffer and convert to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer)),
    );

    return jsonResponse({
      audio: base64Audio,
      contentType: 'audio/mpeg',
    });
  } catch (error) {
    console.error('TTS error:', error);
    return errorResponse(`TTS failed: ${(error as Error).message}`, 500);
  }
});
