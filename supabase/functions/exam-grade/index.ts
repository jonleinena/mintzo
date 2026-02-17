import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, getUserId } from '../_shared/supabase.ts';
import { generateStructuredResponse } from '../_shared/llm.ts';
import {
  GradingResultSchema,
  type GradingResult,
  type ExamScores,
  calculateWeightedAverage,
  mapToCambridgeScale,
  determineGrade,
  getGradingSystemPrompt,
  createGradingPrompt,
} from '../_shared/cambridge-prompts.ts';

interface GradeRequest {
  sessionId: string;
  transcripts: Record<string, string>; // { part1: "...", part3: "...", etc. }
  level: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request
    const { sessionId, transcripts, level } = await req.json() as GradeRequest;

    if (!sessionId || !transcripts || !level) {
      return errorResponse('Missing required fields: sessionId, transcripts, level');
    }

    // Validate level
    if (!['B2', 'C1', 'C2'].includes(level)) {
      return errorResponse('Invalid level. Must be B2, C1, or C2');
    }

    // Create Supabase client with user auth
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);

    // Verify user owns this session
    const userId = await getUserId(supabase, authHeader);
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Check session exists and belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('id, user_id, status')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return errorResponse('Session not found', 404);
    }

    if (session.user_id !== userId) {
      return errorResponse('Unauthorized', 403);
    }

    // Combine all transcripts
    const parts = Object.keys(transcripts).sort();
    const combinedTranscript = parts
      .map(part => `=== ${part.toUpperCase()} ===\n${transcripts[part]}`)
      .join('\n\n');

    if (!combinedTranscript.trim()) {
      return errorResponse('No transcript content provided');
    }

    // Grade using LLM
    const systemPrompt = getGradingSystemPrompt(level);
    const gradingPrompt = createGradingPrompt(combinedTranscript, level, parts);

    const gradingResult = await generateStructuredResponse<GradingResult>({
      schema: GradingResultSchema,
      prompt: gradingPrompt,
      system: systemPrompt,
      model: 'gpt-4o-mini',
    });

    const { scores, feedback } = gradingResult;

    // Calculate final scores
    const averageScore = calculateWeightedAverage(scores);
    const cambridgeScale = mapToCambridgeScale(averageScore, level);
    const grade = determineGrade(cambridgeScale, level);

    // Calculate XP earned (base 100 + score bonus)
    const xpEarned = Math.round(100 + averageScore * 20);

    // Update exam_sessions with results
    const { error: updateError } = await supabase
      .from('exam_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        overall_score: averageScore,
        scores: scores,
        xp_earned: xpEarned,
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Failed to update session:', updateError);
      return errorResponse('Failed to save results');
    }

    // Save part results
    for (const part of parts) {
      const partTranscript = transcripts[part];
      if (!partTranscript) continue;

      const { error: partError } = await supabase
        .from('exam_part_results')
        .insert({
          session_id: sessionId,
          part,
          user_transcript: partTranscript,
          scores: scores,
          feedback: feedback,
        });

      if (partError) {
        console.error(`Failed to save part ${part} results:`, partError);
      }
    }

    // Update user progress
    await updateUserProgress(supabase, userId, level, xpEarned, averageScore);

    return jsonResponse({
      success: true,
      scores,
      feedback,
      averageScore,
      cambridgeScale,
      grade,
      xpEarned,
    });
  } catch (error) {
    console.error('Grading error:', error);
    return errorResponse(`Grading failed: ${(error as Error).message}`, 500);
  }
});

/**
 * Update user progress after completing an exam
 */
async function updateUserProgress(
  supabase: ReturnType<typeof createSupabaseClient>,
  userId: string,
  level: string,
  xpEarned: number,
  score: number,
): Promise<void> {
  // Get current progress
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!progress) return;

  // Update level stats
  const levelStats = progress.level_stats ?? {};
  const currentLevelStats = levelStats[level] ?? { sessions: 0, avgScore: 0, partScores: {} };

  const newSessionCount = currentLevelStats.sessions + 1;
  const newAvgScore = ((currentLevelStats.avgScore * currentLevelStats.sessions) + score) / newSessionCount;

  levelStats[level] = {
    ...currentLevelStats,
    sessions: newSessionCount,
    avgScore: Math.round(newAvgScore * 10) / 10,
  };

  // Calculate new total average
  const totalSessions = progress.total_sessions + 1;
  const newTotalAvg = ((progress.average_score * progress.total_sessions) + score) / totalSessions;

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastPractice = progress.last_practice_date;
  let newStreak = progress.current_streak;

  if (!lastPractice || lastPractice !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastPractice === yesterdayStr) {
      newStreak += 1;
    } else if (lastPractice !== today) {
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(progress.longest_streak, newStreak);

  // Update progress
  await supabase
    .from('user_progress')
    .update({
      total_xp: progress.total_xp + xpEarned,
      total_sessions: totalSessions,
      average_score: Math.round(newTotalAvg * 10) / 10,
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_practice_date: today,
      level_stats: levelStats,
    })
    .eq('user_id', userId);

  // Update daily activity
  await supabase
    .from('daily_activity')
    .upsert({
      user_id: userId,
      date: today,
      sessions_completed: 1,
      xp_earned: xpEarned,
    }, {
      onConflict: 'user_id,date',
      ignoreDuplicates: false,
    });
}
