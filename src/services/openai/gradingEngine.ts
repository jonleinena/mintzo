// OpenAI Grading Engine Service
// Uses GPT-4o-mini to grade Cambridge Speaking exam responses

import OpenAI from 'openai';
import type { ExamLevel, ExamPart, PartScores, PartFeedback } from '@/types/exam';
import type { GradingRequest, GradingResponse, GradingAnalysis, GradingFeedback } from '@/types/scoring';
import { GRADING_PROMPTS, GRADING_SCHEMA } from '@/constants/gradingPrompts';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
});

// Main grading function
export async function gradeTranscript(request: GradingRequest): Promise<GradingResponse> {
  const { level, part, transcript, examinerPrompts, duration, targetDuration } = request;

  // Get level-specific prompts
  const levelPrompts = GRADING_PROMPTS[level];

  // Build context string
  const context = buildContext(part, examinerPrompts, duration, targetDuration);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: levelPrompts.system },
        { role: 'user', content: levelPrompts.getUserPrompt(transcript, context) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: GRADING_SCHEMA,
      },
      temperature: 0.3, // Lower temperature for more consistent grading
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from grading API');
    }

    const gradingResult = JSON.parse(content) as {
      scores: Omit<PartScores, 'pronunciation'>;
      analysis: GradingAnalysis;
      feedback: GradingFeedback;
    };

    return {
      scores: gradingResult.scores,
      analysis: gradingResult.analysis,
      feedback: gradingResult.feedback,
    };
  } catch (error) {
    console.error('Grading error:', error);
    throw new Error(
      `Failed to grade transcript: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Build context string for the prompt
function buildContext(
  part: ExamPart,
  examinerPrompts: string[],
  duration: number,
  targetDuration: number
): string {
  const partNames: Record<ExamPart, string> = {
    part1: 'Part 1: Interview',
    part2: 'Part 2: Long Turn',
    part3: 'Part 3: Collaborative Task',
    part4: 'Part 4: Discussion',
  };

  let context = `${partNames[part]}\n`;
  context += `Duration: ${Math.round(duration)}s (target: ${targetDuration}s)\n`;

  if (examinerPrompts.length > 0) {
    context += `\nExaminer prompts/questions:\n`;
    examinerPrompts.forEach((prompt, i) => {
      context += `${i + 1}. ${prompt}\n`;
    });
  }

  return context;
}

// Grade a full exam session (all parts)
export async function gradeFullSession(
  parts: Array<{
    part: ExamPart;
    transcript: string;
    examinerPrompts: string[];
    duration: number;
    targetDuration: number;
  }>,
  level: ExamLevel
): Promise<GradingResponse[]> {
  // Grade all parts in parallel
  const gradingPromises = parts.map((p) =>
    gradeTranscript({
      level,
      part: p.part,
      transcript: p.transcript,
      examinerPrompts: p.examinerPrompts,
      duration: p.duration,
      targetDuration: p.targetDuration,
    })
  );

  return Promise.all(gradingPromises);
}

// Mock grading for development/testing
export async function mockGradeTranscript(request: GradingRequest): Promise<GradingResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate realistic mock scores based on transcript length and level
  const transcriptLength = request.transcript.split(' ').length;
  const baseScore = Math.min(4.0, 2.5 + transcriptLength / 100);

  // Add some variation
  const variation = () => (Math.random() - 0.5) * 1.0;

  const scores: Omit<PartScores, 'pronunciation'> = {
    grammar: Math.max(0, Math.min(5, baseScore + variation())),
    vocabulary: Math.max(0, Math.min(5, baseScore + variation())),
    discourse: Math.max(0, Math.min(5, baseScore + variation())),
    interaction: Math.max(0, Math.min(5, baseScore + variation())),
    globalAchievement: Math.max(0, Math.min(5, baseScore + variation())),
  };

  // Round to 0.5 increments
  Object.keys(scores).forEach((key) => {
    scores[key as keyof typeof scores] = Math.round(scores[key as keyof typeof scores] * 2) / 2;
  });

  const analysis: GradingAnalysis = {
    grammarErrors: [
      {
        error: 'more better',
        correction: 'much better',
        explanation: 'Use "much" as an intensifier with comparative adjectives',
        severity: 'minor',
      },
    ],
    vocabularyNotes: [
      {
        used: 'good',
        suggestion: 'beneficial/advantageous',
        context: 'Consider using more sophisticated vocabulary at this level',
      },
    ],
    discourseAnalysis:
      'Generally well-organized response with clear main points. Could benefit from more cohesive devices.',
    interactionAnalysis:
      'Responded appropriately to prompts with relevant content. Turn-taking was natural.',
  };

  const feedback: GradingFeedback = {
    summary:
      'A solid performance demonstrating good control of the language. Some minor errors present but communication was effective throughout.',
    strengths: [
      'Good use of linking words (however, although)',
      'Relevant and detailed responses',
      'Natural conversational flow',
    ],
    improvements: [
      'Expand vocabulary range - try using less common synonyms',
      'Work on conditional structures',
      'Practice speaking at length without hesitation',
    ],
    examplePhrases: [
      'From my perspective...',
      "That's an interesting point, however...",
      'I would argue that...',
    ],
  };

  return { scores, analysis, feedback };
}
