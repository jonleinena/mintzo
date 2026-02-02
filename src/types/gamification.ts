export interface DayActivity {
  date: string;
  minutesPracticed: number;
  sessionsCompleted: number;
  xpEarned: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface UserProgress {
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: string;
  streakFreezesAvailable: number;
  totalSessions: number;
  totalPracticeMinutes: number;
  averageScore: number;
}

export type AchievementCategory = 'streak' | 'sessions' | 'level' | 'score' | 'time' | 'special';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: AchievementCategory;
  tier: AchievementTier;
  criteria: Record<string, unknown>;
  xpReward: number;
  isSecret: boolean;
}

export interface UserAchievement {
  achievementId: string;
  progress: number;
  unlockedAt?: Date;
}
