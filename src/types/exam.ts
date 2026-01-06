// Exam types for Mintzo Cambridge Speaking Practice

export type ExamLevel = 'B2' | 'C1' | 'C2';
export type ExamPart = 'part1' | 'part2' | 'part3' | 'part4';
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type SessionType = 'full_exam' | 'single_part';

// Exam part configuration
export interface ExamPartConfig {
  part: ExamPart;
  name: string;
  duration: number; // seconds
  isConversational: boolean; // true for parts 1, 3, 4; false for part 2
  hasImages: boolean;
  description: string;
}

// Exam level configuration
export interface ExamLevelConfig {
  level: ExamLevel;
  name: string;
  totalDuration: number; // seconds
  parts: ExamPartConfig[];
  color: string;
}

// Exam session
export interface ExamSession {
  id: string;
  userId: string;
  level: ExamLevel;
  sessionType: SessionType;
  currentPart: ExamPart;
  partsCompleted: ExamPart[];
  status: SessionStatus;
  isFreeTrial: boolean;
  startedAt: Date;
  completedAt?: Date;
  partResults: ExamPartResult[];
}

// Part-specific content
export interface Part1Content {
  type: 'part1';
  questions: string[];
}

export interface Part2Content {
  type: 'part2';
  images: string[]; // URLs to photos
  prompt: string;
  followUpQuestion: string;
}

export interface Part3Content {
  type: 'part3';
  prompt: string;
  options: string[]; // Discussion options
  centralQuestion: string;
}

export interface Part4Content {
  type: 'part4';
  questions: string[];
  topic: string;
}

export type ExamContent = Part1Content | Part2Content | Part3Content | Part4Content;

// Exam part result
export interface ExamPartResult {
  partId: string;
  part: ExamPart;
  content: ExamContent;
  audioUrl?: string;
  userTranscript: string;
  aiTranscript?: string; // Full conversation for conversational parts
  durationSeconds: number;
  targetDurationSeconds: number;
  scores: PartScores;
  feedback: PartFeedback;
  completedAt: Date;
}

// Scoring types
export interface PartScores {
  grammar: number; // 0-5
  vocabulary: number; // 0-5
  discourse: number; // 0-5
  pronunciation: number; // 0-5
  interaction: number; // 0-5
  globalAchievement: number; // 0-5
}

export interface PartFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  grammarErrors: GrammarError[];
  vocabularyNotes: VocabNote[];
  pronunciationFlags: PronunciationFlag[];
  examplePhrases: string[];
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

export interface PronunciationFlag {
  word: string;
  confidence: number;
  severity: 'minor' | 'severe';
  timestamp?: number;
}

// Final exam results
export interface ExamResults {
  sessionId: string;
  level: ExamLevel;
  isFreeTrial: boolean;
  partResults: ExamPartResult[];
  averageScores: PartScores;
  cambridgeScale: number; // 140-230 depending on level
  grade: ExamGrade;
  xpEarned: number;
  recommendation?: string;
  completedAt: Date;
}

export type ExamGrade = 'Fail' | 'C' | 'B' | 'A' | 'Above Level';

// Cambridge scale configuration per level
export interface CambridgeScaleConfig {
  min: number;
  max: number;
  pass: number;
  gradeB: number;
  gradeA: number;
}
