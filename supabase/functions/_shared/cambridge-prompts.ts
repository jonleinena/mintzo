/**
 * Cambridge English exam grading prompts and scale calculations
 */

import { z } from 'https://esm.sh/zod@3';

// Score schema for structured output
export const ExamScoresSchema = z.object({
  grammar: z.number().min(0).max(5).describe('Grammar accuracy and range (0-5)'),
  vocabulary: z.number().min(0).max(5).describe('Lexical resource and appropriacy (0-5)'),
  discourse: z.number().min(0).max(5).describe('Discourse management and coherence (0-5)'),
  pronunciation: z.number().min(0).max(5).describe('Pronunciation clarity and intonation (0-5)'),
  interaction: z.number().min(0).max(5).describe('Interactive communication (0-5)'),
  globalAchievement: z.number().min(0).max(5).describe('Overall task achievement (0-5)'),
});

export const ExamFeedbackSchema = z.object({
  summary: z.string().describe('2-3 sentence overall assessment'),
  strengths: z.array(z.string()).describe('3-5 specific things done well'),
  improvements: z.array(z.string()).describe('3-5 areas for improvement'),
  examplePhrases: z.array(z.string()).describe('Useful phrases the candidate could use'),
  grammarErrors: z.array(z.object({
    error: z.string(),
    correction: z.string(),
    explanation: z.string(),
  })).describe('Specific grammar errors with corrections'),
  vocabularyNotes: z.array(z.object({
    used: z.string(),
    suggestion: z.string(),
    context: z.string(),
  })).describe('Vocabulary improvements'),
});

export const GradingResultSchema = z.object({
  scores: ExamScoresSchema,
  feedback: ExamFeedbackSchema,
});

export type ExamScores = z.infer<typeof ExamScoresSchema>;
export type ExamFeedback = z.infer<typeof ExamFeedbackSchema>;
export type GradingResult = z.infer<typeof GradingResultSchema>;

// Cambridge scale configuration per level
interface ScaleConfig {
  min: number;
  max: number;
  pass: number;
  gradeB: number;
  gradeA: number;
}

const CAMBRIDGE_SCALE: Record<string, ScaleConfig> = {
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

/**
 * Calculate weighted average of exam scores
 */
export function calculateWeightedAverage(scores: ExamScores): number {
  return Object.entries(scores).reduce(
    (sum, [key, value]) => sum + value * (SCORE_WEIGHTS[key as keyof typeof SCORE_WEIGHTS] ?? 0),
    0,
  );
}

/**
 * Map a 0-5 average score to Cambridge scale
 */
export function mapToCambridgeScale(avgScore: number, level: string): number {
  const config = CAMBRIDGE_SCALE[level] ?? CAMBRIDGE_SCALE.B2;
  const ratio = avgScore / 5;
  return Math.round(config.min + ratio * (config.max - config.min));
}

/**
 * Determine grade based on Cambridge scale score
 */
export function determineGrade(cambridgeScale: number, level: string): string {
  const config = CAMBRIDGE_SCALE[level] ?? CAMBRIDGE_SCALE.B2;
  if (cambridgeScale >= config.max) return 'Above Level';
  if (cambridgeScale >= config.gradeA) return 'A';
  if (cambridgeScale >= config.gradeB) return 'B';
  if (cambridgeScale >= config.pass) return 'C';
  return 'Fail';
}

/**
 * System prompt for Cambridge exam grading
 */
export function getGradingSystemPrompt(level: string): string {
  const levelDescriptions: Record<string, string> = {
    B2: 'B2 First (FCE) - Upper Intermediate. Candidates should demonstrate competent use of English for everyday purposes with reasonable accuracy.',
    C1: 'C1 Advanced (CAE) - Advanced. Candidates should demonstrate sophisticated language use with flexibility and precision.',
    C2: 'C2 Proficiency (CPE) - Proficient. Candidates should demonstrate near-native mastery with exceptional range and accuracy.',
  };

  return `You are an expert Cambridge English examiner grading the Speaking component.

EXAM LEVEL: ${levelDescriptions[level] ?? levelDescriptions.B2}

SCORING CRITERIA (0-5 scale):

1. GRAMMAR (0-5)
   - Range: Variety of grammatical structures used
   - Accuracy: Correctness of grammar
   - Control: Consistent use without systematic errors

2. VOCABULARY (0-5)
   - Range: Breadth of lexical items
   - Appropriacy: Suitability for context and register
   - Precision: Accurate word choice

3. DISCOURSE (0-5)
   - Coherence: Logical flow of ideas
   - Cohesion: Use of linking devices
   - Development: Expansion and elaboration of points

4. PRONUNCIATION (0-5)
   - Individual sounds: Clarity of phonemes
   - Word stress: Correct stress patterns
   - Intonation: Natural rhythm and pitch variation

5. INTERACTIVE COMMUNICATION (0-5)
   - Initiating: Starting and developing exchanges
   - Responding: Appropriate reactions to prompts
   - Turn-taking: Natural conversational flow

6. GLOBAL ACHIEVEMENT (0-5)
   - Task completion: Meeting requirements
   - Overall effectiveness: Communicative success
   - Impression: Confidence and fluency

SCORING GUIDE:
- 5: Exceptional - exceeds level expectations
- 4: Good - fully meets level expectations
- 3: Satisfactory - adequately meets most expectations
- 2: Limited - partially meets expectations with notable weaknesses
- 1: Poor - does not meet expectations
- 0: No response or completely unintelligible

Be fair but rigorous. Provide specific examples from the transcript to justify scores.
Focus on constructive feedback that helps the candidate improve.`;
}

/**
 * Create the grading prompt with transcript
 */
export function createGradingPrompt(transcript: string, level: string, parts: string[]): string {
  const partsDescription = parts.length === 1
    ? `Part ${parts[0].replace('part', '')}`
    : `Parts ${parts.map(p => p.replace('part', '')).join(', ')}`;

  return `Grade the following ${level} Cambridge Speaking exam transcript (${partsDescription}).

TRANSCRIPT:
${transcript}

Analyze the candidate's performance and provide:
1. Scores for all 6 criteria (0-5 scale)
2. Detailed feedback including strengths, areas for improvement, and specific examples

Be specific and reference actual phrases from the transcript in your feedback.`;
}
