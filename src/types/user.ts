import type { ExamLevel } from './exam';

export type AuthType = 'anonymous' | 'email' | 'oauth' | 'academy_invite';

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  authType: AuthType;
  academyId?: string;
  academyGroupId?: string;
  invitedBy?: string;
  onboardingComplete: boolean;
  hasUsedFreeTrial: boolean;
  targetExamLevel: ExamLevel;
  targetExamDate: Date;
  dailyPracticeGoal: number;
  createdAt: Date;
  updatedAt: Date;
}
