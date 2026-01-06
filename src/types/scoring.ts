// Scoring types for Cambridge Speaking Exam grading

import type { ExamLevel, ExamPart, PartScores, PartFeedback } from './exam';

// STT (Speech-to-Text) types
export interface STTResult {
  transcript: string;
  words: WordResult[];
  confidence: number; // Overall 0-1
  duration: number; // seconds
}

export interface WordResult {
  word: string;
  start: number; // Timestamp in seconds
  end: number;
  confidence: number; // 0-1 per word
}

// Pronunciation analysis
export interface PronunciationAnalysis {
  score: number; // 0-5 Cambridge scale
  overallClarity: number; // 0-1
  flaggedWords: FlaggedWord[];
  feedback: string;
}

export interface FlaggedWord {
  word: string;
  confidence: number;
  severity: 'minor' | 'severe';
  timestamp: number;
}

// Grading request/response types
export interface GradingRequest {
  level: ExamLevel;
  part: ExamPart;
  transcript: string;
  examinerPrompts: string[];
  duration: number;
  targetDuration: number;
  isFreeTrial?: boolean;
}

export interface GradingResponse {
  scores: Omit<PartScores, 'pronunciation'>; // Pronunciation scored separately via STT
  analysis: GradingAnalysis;
  feedback: GradingFeedback;
}

export interface GradingAnalysis {
  grammarErrors: {
    error: string;
    correction: string;
    explanation?: string;
    severity: 'minor' | 'major';
  }[];
  vocabularyNotes: {
    used: string;
    suggestion: string;
    context?: string;
  }[];
  discourseAnalysis: string;
  interactionAnalysis: string;
}

export interface GradingFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  examplePhrases?: string[];
}

// Confidence thresholds by exam level
export interface ConfidenceThreshold {
  flag: number; // Below this, word is flagged
  severe: number; // Below this, it's a severe issue
}

// Cambridge scale conversion
export interface ScoreConversion {
  rawScores: PartScores;
  averageScore: number; // Weighted average 0-5
  cambridgeScale: number; // 140-230 based on level
  grade: 'Fail' | 'C' | 'B' | 'A' | 'Above Level';
  recommendation?: string;
}

// Score weights for Cambridge criteria
export interface ScoreWeights {
  grammar: number;
  vocabulary: number;
  discourse: number;
  pronunciation: number;
  interaction: number;
  globalAchievement: number;
}

// Level-specific grading prompt
export interface LevelGradingPrompt {
  system: string;
  getUserPrompt: (transcript: string, context: string) => string;
}
