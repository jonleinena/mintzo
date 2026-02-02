import type { ExamLevel, ExamScores } from '@/types/exam';

interface ScaleConfig {
  min: number;
  max: number;
  pass: number;
  gradeB: number;
  gradeA: number;
}

const CAMBRIDGE_SCALE: Record<ExamLevel, ScaleConfig> = {
  B2: { min: 140, max: 190, pass: 160, gradeB: 173, gradeA: 180 },
  C1: { min: 160, max: 210, pass: 180, gradeB: 193, gradeA: 200 },
  C2: { min: 180, max: 230, pass: 200, gradeB: 213, gradeA: 220 },
};

const SCORE_WEIGHTS = {
  grammar: 0.20,
  vocabulary: 0.20,
  discourse: 0.20,
  pronunciation: 0.15,
  interaction: 0.15,
  globalAchievement: 0.10,
};

export type Grade = 'Fail' | 'C' | 'B' | 'A' | 'Above Level';

export interface FinalScore {
  rawScores: ExamScores;
  averageScore: number;
  cambridgeScale: number;
  grade: Grade;
  recommendation?: string;
}

export function calculateWeightedAverage(scores: ExamScores): number {
  return Object.entries(scores).reduce(
    (sum, [key, value]) => sum + value * (SCORE_WEIGHTS[key as keyof typeof SCORE_WEIGHTS] ?? 0),
    0,
  );
}

export function mapToCambridgeScale(avgScore: number, level: ExamLevel): number {
  const config = CAMBRIDGE_SCALE[level];
  const ratio = avgScore / 5;
  return Math.round(config.min + ratio * (config.max - config.min));
}

export function determineGrade(cambridgeScale: number, level: ExamLevel): Grade {
  const config = CAMBRIDGE_SCALE[level];
  if (cambridgeScale >= config.max) return 'Above Level';
  if (cambridgeScale >= config.gradeA) return 'A';
  if (cambridgeScale >= config.gradeB) return 'B';
  if (cambridgeScale >= config.pass) return 'C';
  return 'Fail';
}

function getNextLevel(level: ExamLevel): ExamLevel | null {
  if (level === 'B2') return 'C1';
  if (level === 'C1') return 'C2';
  return null;
}

export function calculateFinalScore(scores: ExamScores, level: ExamLevel): FinalScore {
  const averageScore = calculateWeightedAverage(scores);
  const cambridgeScale = mapToCambridgeScale(averageScore, level);
  const grade = determineGrade(cambridgeScale, level);

  let recommendation: string | undefined;
  if (averageScore >= 4.5 && grade === 'A') {
    const nextLevel = getNextLevel(level);
    if (nextLevel) {
      recommendation = `Excellent performance! Consider practicing at ${nextLevel} level.`;
    }
  }

  return { rawScores: scores, averageScore, cambridgeScale, grade, recommendation };
}

// Pronunciation analysis from STT confidence
const CONFIDENCE_THRESHOLDS: Record<ExamLevel, { flag: number; severe: number }> = {
  B2: { flag: 0.70, severe: 0.50 },
  C1: { flag: 0.75, severe: 0.55 },
  C2: { flag: 0.80, severe: 0.60 },
};

interface FlaggedWord {
  word: string;
  confidence: number;
  severity: 'minor' | 'severe';
  timestamp: number;
}

export function analyzePronunciation(
  words: Array<{ word: string; start: number; confidence: number }>,
  level: ExamLevel,
): { score: number; flaggedWords: FlaggedWord[] } {
  const threshold = CONFIDENCE_THRESHOLDS[level];
  const flaggedWords: FlaggedWord[] = [];

  for (const w of words) {
    if (w.confidence < threshold.flag) {
      flaggedWords.push({
        word: w.word,
        confidence: w.confidence,
        severity: w.confidence < threshold.severe ? 'severe' : 'minor',
        timestamp: w.start,
      });
    }
  }

  const errorRate = words.length > 0 ? flaggedWords.length / words.length : 0;
  // Map error rate to 0-5 score (inverse, adjusted by level)
  const score = Math.max(0, Math.min(5, 5 * (1 - errorRate * 3)));

  return { score, flaggedWords };
}
