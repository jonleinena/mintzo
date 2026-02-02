import { supabase } from '@/services/supabase/client';
import type { AuthChangeEvent, Session, User as AuthUser } from '@supabase/supabase-js';
import type { User, AuthType } from '@/types/user';

// ---------- Auth operations ----------

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: displayName ? { data: { display_name: displayName } } : undefined,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// ---------- Profile operations ----------

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: updates.displayName,
      avatar_url: updates.avatarUrl,
      academy_id: updates.academyId,
      academy_group_id: updates.academyGroupId,
      onboarding_complete: updates.onboardingComplete,
      has_used_free_trial: updates.hasUsedFreeTrial,
      target_exam_level: updates.targetExamLevel,
      target_exam_date: updates.targetExamDate?.toISOString(),
      daily_practice_goal: updates.dailyPracticeGoal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- Auth state listener ----------

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}

// ---------- Mapping ----------

function resolveAuthType(authUser: AuthUser): AuthType {
  if (authUser.is_anonymous) return 'anonymous';
  const provider = authUser.app_metadata?.provider;
  if (provider && provider !== 'email') return 'oauth';
  if (authUser.user_metadata?.invited_by) return 'academy_invite';
  return 'email';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProfileToUser(profile: Record<string, any>, authUser: AuthUser): User {
  return {
    id: authUser.id,
    email: authUser.email,
    displayName: profile.display_name ?? authUser.user_metadata?.display_name,
    avatarUrl: profile.avatar_url,
    authType: resolveAuthType(authUser),
    academyId: profile.academy_id,
    academyGroupId: profile.academy_group_id,
    invitedBy: profile.invited_by,
    onboardingComplete: profile.onboarding_complete ?? false,
    hasUsedFreeTrial: profile.has_used_free_trial ?? false,
    targetExamLevel: profile.target_exam_level ?? 'B2',
    targetExamDate: profile.target_exam_date ? new Date(profile.target_exam_date) : new Date(),
    dailyPracticeGoal: profile.daily_practice_goal ?? 15,
    createdAt: new Date(profile.created_at ?? authUser.created_at),
    updatedAt: new Date(profile.updated_at ?? authUser.updated_at),
  };
}
