import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, createSupabaseAdmin, getUserId } from '../_shared/supabase.ts';

interface CacheAudioRequest {
  questionId: string;
  level: string;
  part: string;
  audioBase64: string;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);
    const userId = await getUserId(supabase, authHeader);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const { questionId, level, part, audioBase64 } = await req.json() as CacheAudioRequest;

    if (!questionId || !level || !part || !audioBase64) {
      return errorResponse('Missing required fields: questionId, level, part, audioBase64');
    }

    // Decode base64 to binary
    const binaryString = atob(audioBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const storagePath = `audio/${level}/${part}/${questionId}.mp3`;

    // Upload to storage using admin client (service role can write)
    const admin = createSupabaseAdmin();
    const { error: uploadError } = await admin.storage
      .from('exam-content')
      .upload(storagePath, bytes, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload failed:', uploadError);
      return errorResponse('Failed to upload audio', 500);
    }

    // Get public URL
    const { data: urlData } = admin.storage
      .from('exam-content')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Update the question's audio_url
    const { error: updateError } = await admin
      .from('exam_questions')
      .update({ audio_url: publicUrl })
      .eq('id', questionId);

    if (updateError) {
      console.error('Failed to update audio_url:', updateError);
      // Non-fatal - the file is still cached in storage
    }

    return jsonResponse({ url: publicUrl });
  } catch (error) {
    console.error('Cache audio error:', error);
    return errorResponse(`Failed to cache audio: ${(error as Error).message}`, 500);
  }
});
