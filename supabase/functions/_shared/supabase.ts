import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Create a Supabase client with the user's auth token
 * This client respects RLS policies
 */
export function createSupabaseClient(authHeader: string | null): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const options: { global: { headers: Record<string, string> } } = {
    global: {
      headers: {},
    },
  };

  if (authHeader) {
    options.global.headers['Authorization'] = authHeader;
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
}

/**
 * Create a Supabase admin client (bypasses RLS)
 * Use sparingly and only when needed for system operations
 */
export function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

/**
 * Get the authenticated user's ID from the auth header
 */
export async function getUserId(supabase: SupabaseClient): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}
