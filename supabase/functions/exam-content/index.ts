import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, getUserId } from '../_shared/supabase.ts';

interface ExamContentRequest {
  level: string;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { level } = await req.json() as ExamContentRequest;

    if (!level || !['B2', 'C1', 'C2'].includes(level)) {
      return errorResponse('Invalid level. Must be B2, C1, or C2');
    }

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);
    const userId = await getUserId(supabase, authHeader);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Fetch all content for a full exam session in parallel
    const [part1Result, part2Result, part3Result, part4Result] = await Promise.all([
      // Part 1: 6 questions, least used first
      supabase
        .from('exam_questions')
        .select('id, question_text, follow_up_questions, audio_url, topic')
        .eq('level', level)
        .eq('part', 'part1')
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(12),

      // Part 2: 1 visual content set
      supabase
        .from('exam_part2_content')
        .select('id, topic, image_urls, prompt_text, follow_up_question, comparison_points')
        .eq('level', level)
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(5),

      // Part 3: 1 discussion topic
      supabase
        .from('exam_part3_content')
        .select('id, topic, discussion_prompt, options, diagram_mermaid, decision_prompt')
        .eq('level', level)
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(5),

      // Part 4: 5 questions, least used first
      supabase
        .from('exam_questions')
        .select('id, question_text, follow_up_questions, audio_url, topic')
        .eq('level', level)
        .eq('part', 'part4')
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(10),
    ]);

    // Check for errors
    if (part1Result.error) return errorResponse(`Part 1 fetch failed: ${part1Result.error.message}`);
    if (part2Result.error) return errorResponse(`Part 2 fetch failed: ${part2Result.error.message}`);
    if (part3Result.error) return errorResponse(`Part 3 fetch failed: ${part3Result.error.message}`);
    if (part4Result.error) return errorResponse(`Part 4 fetch failed: ${part4Result.error.message}`);

    // Randomly select from fetched content
    const shuffle = <T,>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);

    const part1Questions = shuffle(part1Result.data ?? []).slice(0, 6);
    const part2Content = part2Result.data?.length
      ? part2Result.data[Math.floor(Math.random() * part2Result.data.length)]
      : null;
    const part3Content = part3Result.data?.length
      ? part3Result.data[Math.floor(Math.random() * part3Result.data.length)]
      : null;
    const part4Questions = shuffle(part4Result.data ?? []).slice(0, 5);

    // Increment usage counts atomically
    const contentIds: { table: string; ids: string[] }[] = [];

    if (part1Questions.length > 0) {
      contentIds.push({ table: 'exam_questions', ids: part1Questions.map((q) => q.id) });
    }
    if (part2Content) {
      contentIds.push({ table: 'exam_part2_content', ids: [part2Content.id] });
    }
    if (part3Content) {
      contentIds.push({ table: 'exam_part3_content', ids: [part3Content.id] });
    }
    if (part4Questions.length > 0) {
      contentIds.push({ table: 'exam_questions', ids: part4Questions.map((q) => q.id) });
    }

    // Fire-and-forget usage count updates
    for (const { table, ids } of contentIds) {
      supabase.rpc('increment_usage_count', { p_table: table, p_ids: ids }).then(({ error }) => {
        if (error) console.error(`Failed to increment usage for ${table}:`, error);
      });
    }

    return jsonResponse({
      part1Questions,
      part2Content,
      part3Content,
      part4Questions,
    });
  } catch (error) {
    console.error('Exam content error:', error);
    return errorResponse(`Failed to fetch exam content: ${(error as Error).message}`, 500);
  }
});
