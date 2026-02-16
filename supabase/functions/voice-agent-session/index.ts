import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, createSupabaseAdmin, getUserId } from '../_shared/supabase.ts';

interface AgentSessionRequest {
  level: string;
  part3ContentId?: string;
}

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

function getAgentId(level: string): string {
  const agentIds: Record<string, string | undefined> = {
    B2: Deno.env.get('ELEVENLABS_AGENT_ID_B2_PART3'),
    C1: Deno.env.get('ELEVENLABS_AGENT_ID_C1_PART3'),
    C2: Deno.env.get('ELEVENLABS_AGENT_ID_C2_PART3'),
  };

  const agentId = agentIds[level];
  if (!agentId) {
    throw new Error(`No agent configured for level ${level}`);
  }

  return agentId;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { level, part3ContentId } = await req.json() as AgentSessionRequest;

    if (!level || !['B2', 'C1', 'C2'].includes(level)) {
      return errorResponse('Invalid level. Must be B2, C1, or C2');
    }

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);
    const userId = await getUserId(supabase);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Look up Part 3 content
    let pickedContent: { id: string; discussion_prompt: string; options: string[]; diagram_mermaid?: string; decision_prompt?: string } | null = null;

    const contentFields = 'id, discussion_prompt, options, diagram_mermaid, decision_prompt';

    if (part3ContentId) {
      const { data } = await supabase
        .from('exam_part3_content')
        .select(contentFields)
        .eq('id', part3ContentId)
        .single();

      pickedContent = data;
    }

    // If no specific content requested, pick random content for this level
    if (!pickedContent) {
      const { data } = await supabase
        .from('exam_part3_content')
        .select(contentFields)
        .eq('level', level)
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(5);

      if (data && data.length > 0) {
        pickedContent = data[Math.floor(Math.random() * data.length)];
      }
    }

    const contentId = pickedContent?.id;
    const contentPrompt = pickedContent?.discussion_prompt;
    const contentOptions = pickedContent?.options;
    const diagramMermaid = pickedContent?.diagram_mermaid;
    const decisionPrompt = pickedContent?.decision_prompt;

    // Get signed URL from ElevenLabs
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      return errorResponse('ElevenLabs API key not configured', 500);
    }

    const agentId = getAgentId(level);

    const signedUrlResponse = await fetch(
      `${ELEVENLABS_API_URL}/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      },
    );

    if (!signedUrlResponse.ok) {
      const errorText = await signedUrlResponse.text();
      console.error('ElevenLabs signed URL error:', errorText);
      return errorResponse(`Failed to get signed URL: ${signedUrlResponse.status}`, 502);
    }

    const { signed_url: signedUrl } = await signedUrlResponse.json();

    // Create conversation_sessions row for tracking
    const admin = createSupabaseAdmin();
    const { data: session, error: sessionError } = await admin
      .from('conversation_sessions')
      .insert({
        user_id: userId,
        agent_id: agentId,
        level,
        content_id: contentId ?? null,
        started_at: new Date().toISOString(),
        status: 'in_progress',
      })
      .select('id')
      .single();

    if (sessionError) {
      console.error('Failed to create conversation session:', sessionError);
      return errorResponse('Failed to create session', 500);
    }

    // Increment usage count on the content
    if (contentId) {
      await admin.rpc('increment_usage_count', {
        p_table: 'exam_part3_content',
        p_ids: [contentId],
      });
    }

    return jsonResponse({
      signedUrl,
      agentId,
      sessionId: session.id,
      contentPrompt,
      contentOptions,
      diagramMermaid,
      decisionPrompt,
    });
  } catch (error) {
    console.error('Agent session error:', error);
    return errorResponse(`Failed to create agent session: ${(error as Error).message}`, 500);
  }
});
