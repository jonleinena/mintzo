import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseAdmin } from '../_shared/supabase.ts';

/**
 * Webhook endpoint for ElevenLabs conversation events.
 * Called when a conversation ends - updates conversation_sessions with transcript and duration.
 * Deployed with verify_jwt: false since ElevenLabs won't send a Supabase JWT.
 */

interface ElevenLabsWebhookPayload {
  type: string;
  conversation_id: string;
  agent_id: string;
  status: string;
  transcript?: Array<{
    role: string;
    message: string;
    time_in_call_secs?: number;
  }>;
  metadata?: Record<string, unknown>;
  conversation_initiation_client_data?: Record<string, unknown>;
  analysis?: {
    call_successful?: string;
    transcript_summary?: string;
  };
  duration_secs?: number;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const payload = await req.json() as ElevenLabsWebhookPayload;
    const { conversation_id, status, transcript, duration_secs } = payload;

    if (!conversation_id) {
      return errorResponse('Missing conversation_id');
    }

    const admin = createSupabaseAdmin();

    // Build transcript text from the array
    let transcriptText: string | null = null;
    if (transcript && transcript.length > 0) {
      transcriptText = transcript
        .map((entry) => `${entry.role}: ${entry.message}`)
        .join('\n');
    }

    // Map ElevenLabs status to our status enum
    let sessionStatus = 'completed';
    if (status === 'error' || status === 'failed') {
      sessionStatus = 'error';
    }

    // Update the conversation session
    const { error: updateError } = await admin
      .from('conversation_sessions')
      .update({
        conversation_id,
        transcript: transcriptText,
        ended_at: new Date().toISOString(),
        duration_seconds: duration_secs ? Math.round(duration_secs) : null,
        status: sessionStatus,
      })
      .eq('conversation_id', conversation_id);

    // If no row matched by conversation_id, try to find by agent_id and in_progress status
    // (the conversation_id may have been set on connect, not on session creation)
    if (updateError) {
      console.error('Failed to update conversation session by conversation_id:', updateError);

      // Fallback: update the most recent in_progress session for this agent
      const { error: fallbackError } = await admin
        .from('conversation_sessions')
        .update({
          conversation_id,
          transcript: transcriptText,
          ended_at: new Date().toISOString(),
          duration_seconds: duration_secs ? Math.round(duration_secs) : null,
          status: sessionStatus,
        })
        .eq('agent_id', payload.agent_id)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1);

      if (fallbackError) {
        console.error('Fallback update also failed:', fallbackError);
        return errorResponse('Failed to update session', 500);
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse(`Webhook processing failed: ${(error as Error).message}`, 500);
  }
});
