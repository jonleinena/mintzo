export type ExamLevel = 'B2' | 'C1' | 'C2';
export type ExamPart = 'part1' | 'part2' | 'part3' | 'part4';

export type ExamSessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface ExamSession {
  id: string;
  userId: string;
  level: ExamLevel;
  sessionType: 'full_exam' | 'single_part';
  partsPracticed: ExamPart[];
  status: ExamSessionStatus;
  isFreeTrial: boolean;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  overallScore?: number;
  scores?: ExamScores;
  xpEarned: number;
}

export interface ExamScores {
  grammar: number;
  vocabulary: number;
  discourse: number;
  pronunciation: number;
  interaction: number;
  globalAchievement: number;
}

export interface ExamPartResult {
  id: string;
  sessionId: string;
  part: ExamPart;
  contentId?: string;
  audioUrl?: string;
  userTranscript?: string;
  aiTranscript?: string;
  durationSeconds?: number;
  targetDurationSeconds?: number;
  scores?: ExamScores;
  feedback?: ExamFeedback;
}

export interface ExamFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  examplePhrases?: string[];
  grammarErrors?: GrammarError[];
  vocabularyNotes?: VocabNote[];
}

export interface GrammarError {
  error: string;
  correction: string;
  explanation?: string;
  severity: 'minor' | 'major';
}

export interface VocabNote {
  used: string;
  suggestion: string;
  context?: string;
}

export interface ConversationTurn {
  role: 'examiner' | 'candidate';
  text: string;
  timestamp: Date;
}
