import { supabase } from '@/services/supabase/client';

const XP_CONFIG = {
  fullExam: 100,
  singlePart: 30,
  dailyBonus: 20,
  scoreExcellent: 1.5,
  scoreGood: 1.2,
  scoreAverage: 1.0,
};

const LEVELS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 16500, 20500, 25000, 30000, 36000, 43000, 51000, 60000,
];

export function calculateXP(
  sessionType: 'full_exam' | 'single_part',
  averageScore: number,
  currentStreak: number,
  isFirstSessionToday: boolean,
): number {
  let xp = sessionType === 'full_exam' ? XP_CONFIG.fullExam : XP_CONFIG.singlePart;

  // Score multiplier
  if (averageScore >= 4.5) xp *= XP_CONFIG.scoreExcellent;
  else if (averageScore >= 3.5) xp *= XP_CONFIG.scoreGood;
  else xp *= XP_CONFIG.scoreAverage;

  // Streak multiplier
  if (currentStreak >= 100) xp *= 1.5;
  else if (currentStreak >= 30) xp *= 1.25;
  else if (currentStreak >= 7) xp *= 1.1;

  // Daily bonus
  if (isFirstSessionToday) xp += XP_CONFIG.dailyBonus;

  return Math.round(xp);
}

export function getLevelForXP(totalXP: number): number {
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXP >= LEVELS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVELS.length) return LEVELS[LEVELS.length - 1];
  return LEVELS[currentLevel]; // currentLevel is 1-based, array is 0-based
}

export function getXPProgress(totalXP: number, currentLevel: number): number {
  const currentThreshold = LEVELS[currentLevel - 1] ?? 0;
  const nextThreshold = LEVELS[currentLevel] ?? LEVELS[LEVELS.length - 1];
  const range = nextThreshold - currentThreshold;
  if (range === 0) return 1;
  return (totalXP - currentThreshold) / range;
}

export async function updateProgressAfterSession(
  userId: string,
  xpEarned: number,
  durationMinutes: number,
  averageScore: number,
) {
  // Update user_progress
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!progress) return;

  const today = new Date().toISOString().slice(0, 10);
  const lastPractice = progress.last_practice_date;
  const isConsecutive = lastPractice &&
    (new Date(today).getTime() - new Date(lastPractice).getTime()) <= 86400000;

  const newStreak = isConsecutive ? progress.current_streak + 1 : 1;
  const newTotalXP = progress.total_xp + xpEarned;
  const newLevel = getLevelForXP(newTotalXP);

  await supabase
    .from('user_progress')
    .update({
      total_xp: newTotalXP,
      current_level: newLevel,
      current_streak: newStreak,
      longest_streak: Math.max(progress.longest_streak, newStreak),
      last_practice_date: today,
      total_sessions: progress.total_sessions + 1,
      total_practice_minutes: progress.total_practice_minutes + durationMinutes,
      average_score: progress.total_sessions > 0
        ? ((progress.average_score * progress.total_sessions + averageScore) / (progress.total_sessions + 1))
        : averageScore,
    })
    .eq('user_id', userId);

  // Upsert daily_activity
  await supabase
    .from('daily_activity')
    .upsert({
      user_id: userId,
      date: today,
      minutes_practiced: durationMinutes,
      sessions_completed: 1,
      xp_earned: xpEarned,
    }, { onConflict: 'user_id,date' });

  return { newTotalXP, newLevel, newStreak };
}
