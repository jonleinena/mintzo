import { handleCors, jsonResponse, errorResponse, corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient, getUserId } from '../_shared/supabase.ts';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

interface STTResponse {
  text: string;
  words?: Word[];
}

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

    // Get API key
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      return errorResponse('ElevenLabs API key not configured', 500);
    }

    // Parse multipart form data
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return errorResponse('Audio file is required');
    }

    // Create new FormData for ElevenLabs
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('file', audioFile);
    elevenLabsFormData.append('model_id', 'scribe_v1');

    // Call ElevenLabs Speech-to-Text API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/speech-to-text`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
        },
        body: elevenLabsFormData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs STT error:', errorText);
      return errorResponse(`STT failed: ${response.status}`, 500);
    }

    const result = await response.json();

    // ElevenLabs returns { text: string, words?: [...] }
    const sttResponse: STTResponse = {
      text: result.text ?? '',
      words: result.words?.map((w: { text?: string; word?: string; start: number; end: number; confidence?: number }) => ({
        word: w.text ?? w.word ?? '',
        start: w.start,
        end: w.end,
        confidence: w.confidence ?? 1.0,
      })),
    };

    return jsonResponse(sttResponse);
  } catch (error) {
    console.error('STT error:', error);
    return errorResponse(`STT failed: ${(error as Error).message}`, 500);
  }
});
