// Unit tests for Cambridge Scoring Engine
// Target: 95% coverage for scoring logic

import {
  analyzePronunciation,
  calculatePronunciationBand,
  combineScores,
  calculateWeightedAverage,
  averagePartScores,
  mapToCambridgeScale,
  determineGrade,
  calculateFinalScore,
  calculateXP,
  buildExamResults,
} from '@/features/scoring/services/scoringEngine';
import type { PartScores, ExamPartResult } from '@/types/exam';
import type { STTResult, GradingResponse } from '@/types/scoring';

describe('Scoring Engine', () => {
  describe('analyzePronunciation', () => {
    it('should return high score for perfect pronunciation', () => {
      const sttResult: STTResult = {
        transcript: 'This is a test sentence',
        words: [
          { word: 'This', start: 0, end: 0.2, confidence: 0.95 },
          { word: 'is', start: 0.2, end: 0.3, confidence: 0.98 },
          { word: 'a', start: 0.3, end: 0.35, confidence: 0.99 },
          { word: 'test', start: 0.35, end: 0.5, confidence: 0.96 },
          { word: 'sentence', start: 0.5, end: 0.8, confidence: 0.94 },
        ],
        confidence: 0.96,
        duration: 0.8,
      };

      const result = analyzePronunciation(sttResult, 'B2');

      expect(result.score).toBeGreaterThanOrEqual(4.5);
      expect(result.flaggedWords).toHaveLength(0);
      expect(result.overallClarity).toBe(0.96);
    });

    it('should flag words below confidence threshold for B2', () => {
      const sttResult: STTResult = {
        transcript: 'This pronunciation difficult',
        words: [
          { word: 'This', start: 0, end: 0.2, confidence: 0.95 },
          { word: 'pronunciation', start: 0.2, end: 0.6, confidence: 0.55 }, // Below threshold
          { word: 'difficult', start: 0.6, end: 1.0, confidence: 0.65 }, // Below threshold
        ],
        confidence: 0.72,
        duration: 1.0,
      };

      const result = analyzePronunciation(sttResult, 'B2');

      expect(result.flaggedWords.length).toBeGreaterThan(0);
      expect(result.flaggedWords.some((w) => w.word === 'pronunciation')).toBe(true);
      expect(result.flaggedWords.some((w) => w.severity === 'severe')).toBe(true);
    });

    it('should be stricter for C2 level', () => {
      const sttResult: STTResult = {
        transcript: 'Advanced vocabulary',
        words: [
          { word: 'Advanced', start: 0, end: 0.3, confidence: 0.78 },
          { word: 'vocabulary', start: 0.3, end: 0.7, confidence: 0.75 },
        ],
        confidence: 0.76,
        duration: 0.7,
      };

      const resultB2 = analyzePronunciation(sttResult, 'B2');
      const resultC2 = analyzePronunciation(sttResult, 'C2');

      // C2 should flag more words than B2 for same confidence
      expect(resultC2.flaggedWords.length).toBeGreaterThanOrEqual(resultB2.flaggedWords.length);
    });
  });

  describe('calculatePronunciationBand', () => {
    it('should return 5.0 for near-perfect pronunciation (< 2% errors)', () => {
      expect(calculatePronunciationBand(0.01, 'B2')).toBe(5.0);
      expect(calculatePronunciationBand(0.015, 'C1')).toBe(5.0);
    });

    it('should return lower scores for higher error rates', () => {
      expect(calculatePronunciationBand(0.10, 'B2')).toBe(3.5);
      expect(calculatePronunciationBand(0.20, 'B2')).toBe(2.5);
      expect(calculatePronunciationBand(0.40, 'B2')).toBe(1.5);
    });

    it('should apply level-specific multipliers', () => {
      const errorRate = 0.10;

      const scoreB2 = calculatePronunciationBand(errorRate, 'B2');
      const scoreC2 = calculatePronunciationBand(errorRate, 'C2');

      // B2 should be more lenient (higher score) than C2
      expect(scoreB2).toBeGreaterThan(scoreC2);
    });

    it('should handle edge cases', () => {
      expect(calculatePronunciationBand(0, 'B2')).toBe(5.0);
      expect(calculatePronunciationBand(1.0, 'B2')).toBe(0.5);
    });
  });

  describe('combineScores', () => {
    it('should combine LLM scores with pronunciation score', () => {
      const gradingResponse: GradingResponse = {
        scores: {
          grammar: 4.0,
          vocabulary: 3.5,
          discourse: 4.0,
          interaction: 3.5,
          globalAchievement: 4.0,
        },
        analysis: {
          grammarErrors: [],
          vocabularyNotes: [],
          discourseAnalysis: '',
          interactionAnalysis: '',
        },
        feedback: {
          summary: '',
          strengths: [],
          improvements: [],
        },
      };

      const pronunciationScore = 3.5;
      const combined = combineScores(gradingResponse, pronunciationScore);

      expect(combined.grammar).toBe(4.0);
      expect(combined.vocabulary).toBe(3.5);
      expect(combined.pronunciation).toBe(3.5);
      expect(combined.discourse).toBe(4.0);
      expect(combined.interaction).toBe(3.5);
      expect(combined.globalAchievement).toBe(4.0);
    });
  });

  describe('calculateWeightedAverage', () => {
    it('should calculate correct weighted average', () => {
      const scores: PartScores = {
        grammar: 4.0, // 20%
        vocabulary: 4.0, // 20%
        discourse: 4.0, // 20%
        pronunciation: 4.0, // 15%
        interaction: 4.0, // 15%
        globalAchievement: 4.0, // 10%
      };

      const average = calculateWeightedAverage(scores);
      expect(average).toBe(4.0);
    });

    it('should weight scores correctly when different', () => {
      const scores: PartScores = {
        grammar: 5.0, // 20% = 1.0
        vocabulary: 5.0, // 20% = 1.0
        discourse: 5.0, // 20% = 1.0
        pronunciation: 0.0, // 15% = 0.0
        interaction: 0.0, // 15% = 0.0
        globalAchievement: 0.0, // 10% = 0.0
      };

      const average = calculateWeightedAverage(scores);
      // Grammar + Vocab + Discourse = 0.20 + 0.20 + 0.20 = 0.60 * 5 = 3.0
      expect(average).toBe(3.0);
    });
  });

  describe('averagePartScores', () => {
    it('should average scores across multiple parts', () => {
      const partScores: PartScores[] = [
        {
          grammar: 4.0,
          vocabulary: 4.0,
          discourse: 4.0,
          pronunciation: 4.0,
          interaction: 4.0,
          globalAchievement: 4.0,
        },
        {
          grammar: 2.0,
          vocabulary: 2.0,
          discourse: 2.0,
          pronunciation: 2.0,
          interaction: 2.0,
          globalAchievement: 2.0,
        },
      ];

      const averaged = averagePartScores(partScores);

      expect(averaged.grammar).toBe(3.0);
      expect(averaged.vocabulary).toBe(3.0);
      expect(averaged.discourse).toBe(3.0);
      expect(averaged.pronunciation).toBe(3.0);
      expect(averaged.interaction).toBe(3.0);
      expect(averaged.globalAchievement).toBe(3.0);
    });

    it('should handle empty array', () => {
      const averaged = averagePartScores([]);

      expect(averaged.grammar).toBe(0);
      expect(averaged.vocabulary).toBe(0);
    });

    it('should handle single part', () => {
      const partScores: PartScores[] = [
        {
          grammar: 4.5,
          vocabulary: 3.5,
          discourse: 4.0,
          pronunciation: 3.0,
          interaction: 4.0,
          globalAchievement: 3.5,
        },
      ];

      const averaged = averagePartScores(partScores);

      expect(averaged.grammar).toBe(4.5);
      expect(averaged.vocabulary).toBe(3.5);
    });
  });

  describe('mapToCambridgeScale', () => {
    it('should map B2 scores to correct Cambridge Scale range', () => {
      // B2: min 140, max 190
      expect(mapToCambridgeScale(0, 'B2')).toBe(140);
      expect(mapToCambridgeScale(5, 'B2')).toBe(190);
      expect(mapToCambridgeScale(2.5, 'B2')).toBe(165); // Midpoint
    });

    it('should map C1 scores to correct Cambridge Scale range', () => {
      // C1: min 160, max 210
      expect(mapToCambridgeScale(0, 'C1')).toBe(160);
      expect(mapToCambridgeScale(5, 'C1')).toBe(210);
      expect(mapToCambridgeScale(2.5, 'C1')).toBe(185);
    });

    it('should map C2 scores to correct Cambridge Scale range', () => {
      // C2: min 180, max 230
      expect(mapToCambridgeScale(0, 'C2')).toBe(180);
      expect(mapToCambridgeScale(5, 'C2')).toBe(230);
      expect(mapToCambridgeScale(2.5, 'C2')).toBe(205);
    });
  });

  describe('determineGrade', () => {
    describe('B2 Level', () => {
      it('should return Fail for scores below pass threshold', () => {
        expect(determineGrade(155, 'B2')).toBe('Fail');
        expect(determineGrade(159, 'B2')).toBe('Fail');
      });

      it('should return C for passing scores', () => {
        expect(determineGrade(160, 'B2')).toBe('C');
        expect(determineGrade(170, 'B2')).toBe('C');
      });

      it('should return B for grade B scores', () => {
        expect(determineGrade(173, 'B2')).toBe('B');
        expect(determineGrade(179, 'B2')).toBe('B');
      });

      it('should return A for grade A scores', () => {
        expect(determineGrade(180, 'B2')).toBe('A');
        expect(determineGrade(189, 'B2')).toBe('A');
      });

      it('should return Above Level for max scores', () => {
        expect(determineGrade(190, 'B2')).toBe('Above Level');
      });
    });

    describe('C1 Level', () => {
      it('should return correct grades for C1 thresholds', () => {
        expect(determineGrade(175, 'C1')).toBe('Fail');
        expect(determineGrade(180, 'C1')).toBe('C');
        expect(determineGrade(193, 'C1')).toBe('B');
        expect(determineGrade(200, 'C1')).toBe('A');
        expect(determineGrade(210, 'C1')).toBe('Above Level');
      });
    });

    describe('C2 Level', () => {
      it('should return correct grades for C2 thresholds', () => {
        expect(determineGrade(195, 'C2')).toBe('Fail');
        expect(determineGrade(200, 'C2')).toBe('C');
        expect(determineGrade(213, 'C2')).toBe('B');
        expect(determineGrade(220, 'C2')).toBe('A');
        expect(determineGrade(230, 'C2')).toBe('Above Level');
      });
    });
  });

  describe('calculateXP', () => {
    it('should calculate base XP for full exam', () => {
      const xp = calculateXP(3.0, 'full_exam', 0);
      expect(xp).toBe(100);
    });

    it('should calculate base XP for single part', () => {
      const xp = calculateXP(3.0, 'single_part', 0);
      expect(xp).toBe(30);
    });

    it('should apply score multiplier for high scores', () => {
      const lowScoreXP = calculateXP(3.0, 'full_exam', 0);
      const highScoreXP = calculateXP(4.5, 'full_exam', 0);

      expect(highScoreXP).toBeGreaterThan(lowScoreXP);
      expect(highScoreXP).toBe(150); // 100 * 1.5
    });

    it('should apply streak multiplier', () => {
      const noStreakXP = calculateXP(3.0, 'full_exam', 0);
      const weekStreakXP = calculateXP(3.0, 'full_exam', 7);
      const monthStreakXP = calculateXP(3.0, 'full_exam', 30);
      const longStreakXP = calculateXP(3.0, 'full_exam', 100);

      expect(weekStreakXP).toBeGreaterThan(noStreakXP);
      expect(monthStreakXP).toBeGreaterThan(weekStreakXP);
      expect(longStreakXP).toBeGreaterThan(monthStreakXP);
    });

    it('should combine score and streak multipliers', () => {
      const xp = calculateXP(4.5, 'full_exam', 100);
      // Base: 100, Score: 1.5x, Streak: 1.5x = 225
      expect(xp).toBe(225);
    });
  });

  describe('calculateFinalScore', () => {
    const createMockPartResult = (scores: PartScores): ExamPartResult => ({
      partId: 'test-part',
      part: 'part1',
      content: { type: 'part1', questions: [] },
      userTranscript: '',
      durationSeconds: 120,
      targetDurationSeconds: 120,
      completedAt: new Date(),
      scores,
      feedback: {
        summary: '',
        strengths: [],
        improvements: [],
        grammarErrors: [],
        vocabularyNotes: [],
        pronunciationFlags: [],
        examplePhrases: [],
      },
    });

    it('should calculate final score with all components', () => {
      const partResults: ExamPartResult[] = [
        createMockPartResult({
          grammar: 4.0,
          vocabulary: 4.0,
          discourse: 4.0,
          pronunciation: 4.0,
          interaction: 4.0,
          globalAchievement: 4.0,
        }),
      ];

      const result = calculateFinalScore(partResults, 'B2');

      expect(result.rawScores.grammar).toBe(4.0);
      expect(result.averageScore).toBe(4.0);
      expect(result.cambridgeScale).toBe(180); // (4/5) * 50 + 140
      expect(result.grade).toBe('A');
    });

    it('should provide recommendation for high performers', () => {
      const partResults: ExamPartResult[] = [
        createMockPartResult({
          grammar: 4.8,
          vocabulary: 4.7,
          discourse: 4.5,
          pronunciation: 4.6,
          interaction: 4.8,
          globalAchievement: 4.5,
        }),
      ];

      const result = calculateFinalScore(partResults, 'B2');

      expect(result.grade).toBe('A');
      expect(result.recommendation).toContain('C1');
    });

    it('should provide recommendation for those needing improvement', () => {
      const partResults: ExamPartResult[] = [
        createMockPartResult({
          grammar: 2.5,
          vocabulary: 2.5,
          discourse: 2.0,
          pronunciation: 2.0,
          interaction: 2.5,
          globalAchievement: 2.0,
        }),
      ];

      const result = calculateFinalScore(partResults, 'B2');

      expect(result.grade).toBe('Fail');
      expect(result.recommendation).toContain('practicing');
    });
  });

  describe('buildExamResults', () => {
    it('should build complete exam results object', () => {
      const partResults: ExamPartResult[] = [
        {
          partId: 'part1',
          part: 'part1',
          content: { type: 'part1', questions: [] },
          userTranscript: 'Test transcript',
          durationSeconds: 120,
          targetDurationSeconds: 120,
          completedAt: new Date(),
          scores: {
            grammar: 3.5,
            vocabulary: 4.0,
            discourse: 3.5,
            pronunciation: 3.5,
            interaction: 4.0,
            globalAchievement: 3.5,
          },
          feedback: {
            summary: 'Good performance',
            strengths: ['Clear speech'],
            improvements: ['Work on grammar'],
            grammarErrors: [],
            vocabularyNotes: [],
            pronunciationFlags: [],
            examplePhrases: [],
          },
        },
      ];

      const results = buildExamResults(
        'session-123',
        'B2',
        false,
        partResults,
        7 // 7-day streak
      );

      expect(results.sessionId).toBe('session-123');
      expect(results.level).toBe('B2');
      expect(results.isFreeTrial).toBe(false);
      expect(results.partResults).toHaveLength(1);
      expect(results.averageScores.grammar).toBe(3.5);
      expect(results.cambridgeScale).toBeGreaterThan(160);
      expect(results.grade).not.toBe('Fail');
      expect(results.xpEarned).toBeGreaterThan(0);
      expect(results.completedAt).toBeInstanceOf(Date);
    });

    it('should handle free trial sessions', () => {
      const partResults: ExamPartResult[] = [
        {
          partId: 'part1',
          part: 'part1',
          content: { type: 'part1', questions: [] },
          userTranscript: '',
          durationSeconds: 60,
          targetDurationSeconds: 120,
          completedAt: new Date(),
          scores: {
            grammar: 3.0,
            vocabulary: 3.0,
            discourse: 3.0,
            pronunciation: 3.0,
            interaction: 3.0,
            globalAchievement: 3.0,
          },
          feedback: {
            summary: '',
            strengths: [],
            improvements: [],
            grammarErrors: [],
            vocabularyNotes: [],
            pronunciationFlags: [],
            examplePhrases: [],
          },
        },
      ];

      const results = buildExamResults(
        'free-trial',
        'B2',
        true,
        partResults,
        0
      );

      expect(results.isFreeTrial).toBe(true);
    });
  });
});
