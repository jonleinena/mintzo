import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, createSupabaseAdmin, getUserId } from '../_shared/supabase.ts';

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

    const admin = createSupabaseAdmin();

    // Revoke RevenueCat subscriber access concurrently with DB cleanup.
    // This doesn't cancel the Apple subscription - the user must do that
    // in Settings > Subscriptions.
    const rcApiKey = Deno.env.get('REVENUECAT_API_V1_KEY');
    const rcPromise = rcApiKey
      ? fetch(`https://api.revenuecat.com/v1/subscribers/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${rcApiKey}`, 'Content-Type': 'application/json' },
        }).catch((e) => console.error('RevenueCat subscriber delete failed:', e))
      : Promise.resolve();

    // Delete exam_part_results via exam_sessions (no direct user_id column)
    const { data: sessions } = await admin
      .from('exam_sessions')
      .select('id')
      .eq('user_id', userId);

    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.id);
      await admin.from('exam_part_results').delete().in('session_id', sessionIds);
    }

    await rcPromise;

    // Delete all user-owned rows from tables with user_id column
    await Promise.all([
      admin.from('exam_sessions').delete().eq('user_id', userId),
      admin.from('conversation_sessions').delete().eq('user_id', userId),
      admin.from('daily_activity').delete().eq('user_id', userId),
      admin.from('user_achievements').delete().eq('user_id', userId),
      admin.from('user_progress').delete().eq('user_id', userId),
      admin.from('subscriptions').delete().eq('user_id', userId),
    ]);

    // Delete profile (uses id, not user_id)
    await admin.from('profiles').delete().eq('id', userId);

    // Delete the auth user
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError);
      return errorResponse('Failed to delete account', 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return errorResponse(`Failed to delete account: ${(error as Error).message}`, 500);
  }
});
