// Cambridge Scoring Engine
// Combines STT pronunciation analysis with LLM grading

import type {
  ExamLevel,
  ExamGrade,
  PartScores,
  ExamResults,
  ExamPartResult,
  PronunciationFlag,
} from '@/types/exam';
import type {
  STTResult,
  FlaggedWord,
  PronunciationAnalysis,
  ScoreConversion,
  GradingResponse,
} from '@/types/scoring';
import {
  CAMBRIDGE_SCALE,
  SCORE_WEIGHTS,
  CONFIDENCE_THRESHOLDS,
} from '@/constants/examConfig';

// Analyze pronunciation from STT results
export function analyzePronunciation(
  sttResult: STTResult,
  level: ExamLevel
): PronunciationAnalysis {
  const thresholds = CONFIDENCE_THRESHOLDS[level];
  const flaggedWords: FlaggedWord[] = [];

  for (const word of sttResult.words) {
    if (word.confidence < thresholds.flag) {
      flaggedWords.push({
        word: word.word,
        confidence: word.confidence,
        severity: word.confidence < thresholds.severe ? 'severe' : 'minor',
        timestamp: word.start,
      });
    }
  }

  // Calculate pronunciation score (0-5 Cambridge scale)
  const errorRate = sttResult.words.length > 0
    ? flaggedWords.length / sttResult.words.length
    : 0;
  const score = calculatePronunciationBand(errorRate, level);

  return {
    score,
    overallClarity: sttResult.confidence,
    flaggedWords,
    feedback: generatePronunciationFeedback(flaggedWords, level),
  };
}

// Calculate pronunciation band score based on error rate
export function calculatePronunciationBand(errorRate: number, level: ExamLevel): number {
  // Adjust expectations by level
  const levelMultiplier: Record<ExamLevel, number> = {
    B2: 1.2, // More lenient
    C1: 1.0,
    C2: 0.8, // Stricter
  };

  const adjustedErrorRate = errorRate / levelMultiplier[level];

  // Map error rate to 0-5 score
  if (adjustedErrorRate <= 0.02) return 5.0; // Near perfect
  if (adjustedErrorRate <= 0.05) return 4.5;
  if (adjustedErrorRate <= 0.08) return 4.0;
  if (adjustedErrorRate <= 0.12) return 3.5;
  if (adjustedErrorRate <= 0.18) return 3.0;
  if (adjustedErrorRate <= 0.25) return 2.5;
  if (adjustedErrorRate <= 0.35) return 2.0;
  if (adjustedErrorRate <= 0.50) return 1.5;
  if (adjustedErrorRate <= 0.70) return 1.0;
  return 0.5;
}

// Generate pronunciation feedback
function generatePronunciationFeedback(flaggedWords: FlaggedWord[], level: ExamLevel): string {
  if (flaggedWords.length === 0) {
    return 'Excellent pronunciation with clear articulation throughout.';
  }

  const severeCount = flaggedWords.filter((w) => w.severity === 'severe').length;
  const minorCount = flaggedWords.filter((w) => w.severity === 'minor').length;

  const parts: string[] = [];

  if (severeCount > 0) {
    const severeWords = flaggedWords
      .filter((w) => w.severity === 'severe')
      .slice(0, 3)
      .map((w) => `"${w.word}"`)
      .join(', ');
    parts.push(`Work on clearer pronunciation of: ${severeWords}`);
  }

  if (minorCount > 0 && minorCount <= 3) {
    parts.push(`Minor clarity issues detected in a few words`);
  } else if (minorCount > 3) {
    parts.push(`Consider slowing down slightly to improve clarity`);
  }

  if (parts.length === 0) {
    return 'Good pronunciation overall with some minor areas for improvement.';
  }

  return parts.join('. ') + '.';
}

// Combine LLM grading with pronunciation score
export function combineScores(
  gradingResponse: GradingResponse,
  pronunciationScore: number
): PartScores {
  return {
    grammar: gradingResponse.scores.grammar,
    vocabulary: gradingResponse.scores.vocabulary,
    discourse: gradingResponse.scores.discourse,
    pronunciation: pronunciationScore,
    interaction: gradingResponse.scores.interaction,
    globalAchievement: gradingResponse.scores.globalAchievement,
  };
}

// Calculate weighted average score
export function calculateWeightedAverage(scores: PartScores): number {
  return (
    scores.grammar * SCORE_WEIGHTS.grammar +
    scores.vocabulary * SCORE_WEIGHTS.vocabulary +
    scores.discourse * SCORE_WEIGHTS.discourse +
    scores.pronunciation * SCORE_WEIGHTS.pronunciation +
    scores.interaction * SCORE_WEIGHTS.interaction +
    scores.globalAchievement * SCORE_WEIGHTS.globalAchievement
  );
}

// Average scores across multiple parts
export function averagePartScores(partScores: PartScores[]): PartScores {
  if (partScores.length === 0) {
    return {
      grammar: 0,
      vocabulary: 0,
      discourse: 0,
      pronunciation: 0,
      interaction: 0,
      globalAchievement: 0,
    };
  }

  const sumScores = partScores.reduce(
    (acc, scores) => ({
      grammar: acc.grammar + scores.grammar,
      vocabulary: acc.vocabulary + scores.vocabulary,
      discourse: acc.discourse + scores.discourse,
      pronunciation: acc.pronunciation + scores.pronunciation,
      interaction: acc.interaction + scores.interaction,
      globalAchievement: acc.globalAchievement + scores.globalAchievement,
    }),
    {
      grammar: 0,
      vocabulary: 0,
      discourse: 0,
      pronunciation: 0,
      interaction: 0,
      globalAchievement: 0,
    }
  );

  const count = partScores.length;
  return {
    grammar: sumScores.grammar / count,
    vocabulary: sumScores.vocabulary / count,
    discourse: sumScores.discourse / count,
    pronunciation: sumScores.pronunciation / count,
    interaction: sumScores.interaction / count,
    globalAchievement: sumScores.globalAchievement / count,
  };
}

// Convert 0-5 average to Cambridge Scale
export function mapToCambridgeScale(averageScore: number, level: ExamLevel): number {
  const config = CAMBRIDGE_SCALE[level];

  // Map 0-5 average to Cambridge Scale range
  // 0 -> min, 5 -> max
  const scoreRatio = averageScore / 5;
  const scaleRange = config.max - config.min;

  return Math.round(config.min + scoreRatio * scaleRange);
}

// Determine grade from Cambridge Scale score
export function determineGrade(cambridgeScale: number, level: ExamLevel): ExamGrade {
  const config = CAMBRIDGE_SCALE[level];

  if (cambridgeScale >= config.max) return 'Above Level';
  if (cambridgeScale >= config.gradeA) return 'A';
  if (cambridgeScale >= config.gradeB) return 'B';
  if (cambridgeScale >= config.pass) return 'C';
  return 'Fail';
}

// Get next level suggestion
function getNextLevel(level: ExamLevel): ExamLevel | null {
  switch (level) {
    case 'B2':
      return 'C1';
    case 'C1':
      return 'C2';
    case 'C2':
      return null;
  }
}

// Calculate final score conversion
export function calculateFinalScore(
  partResults: ExamPartResult[],
  level: ExamLevel
): ScoreConversion {
  // Average all part scores
  const partScores = partResults.map((p) => p.scores);
  const averageScores = averagePartScores(partScores);

  // Calculate weighted average
  const averageScore = calculateWeightedAverage(averageScores);

  // Convert to Cambridge Scale
  const cambridgeScale = mapToCambridgeScale(averageScore, level);

  // Determine grade
  const grade = determineGrade(cambridgeScale, level);

  // Generate recommendation if scoring above level
  let recommendation: string | undefined;
  if (averageScore >= 4.5 && grade === 'A') {
    const nextLevel = getNextLevel(level);
    if (nextLevel) {
      recommendation = `Excellent performance! Consider practicing at ${nextLevel} level.`;
    }
  } else if (grade === 'Fail' && averageScore >= 2.0) {
    recommendation = `Keep practicing! Focus on ${getWeakestAreas(averageScores).join(' and ')}.`;
  }

  return {
    rawScores: averageScores,
    averageScore,
    cambridgeScale,
    grade,
    recommendation,
  };
}

// Get weakest scoring areas
function getWeakestAreas(scores: PartScores): string[] {
  const areas: Array<{ name: string; score: number }> = [
    { name: 'grammar', score: scores.grammar },
    { name: 'vocabulary', score: scores.vocabulary },
    { name: 'discourse', score: scores.discourse },
    { name: 'pronunciation', score: scores.pronunciation },
    { name: 'interaction', score: scores.interaction },
  ];

  // Sort by score ascending and take bottom 2
  areas.sort((a, b) => a.score - b.score);
  return areas.slice(0, 2).map((a) => a.name);
}

// Calculate XP earned for a session
export function calculateXP(
  averageScore: number,
  sessionType: 'full_exam' | 'single_part',
  currentStreak: number
): number {
  // Base XP
  let xp = sessionType === 'full_exam' ? 100 : 30;

  // Score multiplier
  if (averageScore >= 4.5) {
    xp *= 1.5;
  } else if (averageScore >= 3.5) {
    xp *= 1.2;
  }

  // Streak multiplier
  if (currentStreak >= 100) {
    xp *= 1.5;
  } else if (currentStreak >= 30) {
    xp *= 1.25;
  } else if (currentStreak >= 7) {
    xp *= 1.1;
  }

  return Math.round(xp);
}

// Build complete exam results
export function buildExamResults(
  sessionId: string,
  level: ExamLevel,
  isFreeTrial: boolean,
  partResults: ExamPartResult[],
  currentStreak: number
): ExamResults {
  const finalScore = calculateFinalScore(partResults, level);
  const xpEarned = calculateXP(
    finalScore.averageScore,
    partResults.length > 1 ? 'full_exam' : 'single_part',
    currentStreak
  );

  return {
    sessionId,
    level,
    isFreeTrial,
    partResults,
    averageScores: finalScore.rawScores,
    cambridgeScale: finalScore.cambridgeScale,
    grade: finalScore.grade,
    xpEarned,
    recommendation: finalScore.recommendation,
    completedAt: new Date(),
  };
}
