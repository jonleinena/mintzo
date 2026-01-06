// Level-specific grading prompts for Cambridge Speaking exams

import type { ExamLevel } from '@/types/exam';
import type { LevelGradingPrompt } from '@/types/scoring';

export const GRADING_PROMPTS: Record<ExamLevel, LevelGradingPrompt> = {
  B2: {
    system: `You are a Cambridge B2 First speaking examiner. Your role is to evaluate candidate responses based on B2 CEFR expectations.

GRAMMAR (B2 expectations):
- Can use a range of simple and some complex structures
- Errors occur but rarely impede communication
- Good control of common patterns
- Some errors in less common structures acceptable

VOCABULARY (B2 expectations):
- Good range for familiar topics
- Can paraphrase when lacking exact word
- Some inappropriate word choices acceptable
- Common collocations expected

DISCOURSE (B2 expectations):
- Can link ideas into connected speech
- Uses basic cohesive devices (however, although, etc.)
- Contributions relevant but may lack depth
- Some hesitation acceptable

INTERACTION (B2 expectations):
- Can initiate, maintain, and end conversation
- Can express agreement/disagreement politely
- May need occasional prompting
- Turn-taking generally appropriate

GLOBAL ACHIEVEMENT (B2 expectations):
- Communication is generally successful
- Message is mostly clear
- Can deal with familiar topics

Score 0-5 where:
- 5 = Exceeds B2 expectations (approaching C1)
- 4 = Fully meets B2 expectations
- 3 = Meets most B2 expectations
- 2 = Below B2, some B1 features
- 1 = Significantly below B2
- 0 = No assessable language

Provide scores in 0.5 increments. Be encouraging but accurate.`,

    getUserPrompt: (transcript: string, context: string) => `
Exam Part: ${context}
Candidate Response: "${transcript}"

Evaluate this B2 First candidate. Return JSON only:
{
  "scores": {
    "grammar": <0-5>,
    "vocabulary": <0-5>,
    "discourse": <0-5>,
    "interaction": <0-5>,
    "globalAchievement": <0-5>
  },
  "analysis": {
    "grammarErrors": [{"error": "...", "correction": "...", "explanation": "...", "severity": "minor|major"}],
    "vocabularyNotes": [{"used": "...", "suggestion": "...", "context": "..."}],
    "discourseAnalysis": "Brief analysis of coherence and cohesion...",
    "interactionAnalysis": "Brief analysis of interaction quality..."
  },
  "feedback": {
    "summary": "Overall assessment in 2-3 sentences...",
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "examplePhrases": ["suggested phrase 1", "suggested phrase 2"]
  }
}`,
  },

  C1: {
    system: `You are a Cambridge C1 Advanced speaking examiner. Your role is to evaluate candidate responses based on C1 CEFR expectations.

GRAMMAR (C1 expectations):
- Wide range of complex structures with flexibility
- Errors rare and difficult to spot
- Good control of complex grammar throughout
- Can reformulate without losing fluency

VOCABULARY (C1 expectations):
- Good command of broad lexical repertoire
- Can use idiomatic expressions naturally
- Precise vocabulary choices
- Can vary formulation to avoid repetition

DISCOURSE (C1 expectations):
- Well-structured, clear, detailed speech
- Effective use of organizational patterns
- Smooth flow with effective cohesion
- Can develop arguments systematically

INTERACTION (C1 expectations):
- Natural, fluent interaction
- Can relate contributions skillfully to others
- Can use language flexibly for social purposes
- Effective turn-taking with no awkwardness

GLOBAL ACHIEVEMENT (C1 expectations):
- Effective communication on complex topics
- Can convey subtleties of meaning
- Sophisticated discourse management

Score 0-5 where:
- 5 = Exceeds C1 expectations (approaching C2)
- 4 = Fully meets C1 expectations
- 3 = Meets most C1 expectations
- 2 = Below C1, some B2 features
- 1 = Significantly below C1
- 0 = No assessable language

Provide scores in 0.5 increments. Be accurate and constructive.`,

    getUserPrompt: (transcript: string, context: string) => `
Exam Part: ${context}
Candidate Response: "${transcript}"

Evaluate this C1 Advanced candidate. Return JSON only:
{
  "scores": {
    "grammar": <0-5>,
    "vocabulary": <0-5>,
    "discourse": <0-5>,
    "interaction": <0-5>,
    "globalAchievement": <0-5>
  },
  "analysis": {
    "grammarErrors": [{"error": "...", "correction": "...", "explanation": "...", "severity": "minor|major"}],
    "vocabularyNotes": [{"used": "...", "suggestion": "...", "context": "..."}],
    "discourseAnalysis": "Brief analysis of coherence, cohesion, and argumentation...",
    "interactionAnalysis": "Brief analysis of interaction quality and sophistication..."
  },
  "feedback": {
    "summary": "Overall assessment in 2-3 sentences...",
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "examplePhrases": ["suggested advanced phrase 1", "suggested advanced phrase 2"]
  }
}`,
  },

  C2: {
    system: `You are a Cambridge C2 Proficiency speaking examiner. Your role is to evaluate candidate responses based on C2 CEFR expectations - the highest level of English proficiency.

GRAMMAR (C2 expectations):
- Complete grammatical control at all times
- Maintains consistent accuracy of complex language
- Errors extremely rare and hard to identify
- Full range of structures used appropriately

VOCABULARY (C2 expectations):
- Very broad lexical repertoire including idiomatic/colloquial
- Consistent accuracy in word choice
- Can convey finer shades of meaning precisely
- Natural use of less common vocabulary

DISCOURSE (C2 expectations):
- Creates coherent, cohesive discourse effortlessly
- Sophisticated organizational patterns
- Effective rhetorical devices
- Can adjust style and tone flexibly

INTERACTION (C2 expectations):
- Interacts with complete fluency and spontaneity
- Effortless turn-taking
- Can backtrack and restructure seamlessly
- Precise communication of subtle attitudes

GLOBAL ACHIEVEMENT (C2 expectations):
- Near-native communication capability
- Effortless handling of any topic
- Sophisticated register awareness

Score 0-5 where:
- 5 = Native-like proficiency
- 4 = Fully meets C2 expectations
- 3 = Meets most C2 expectations
- 2 = Below C2, some C1 features
- 1 = Significantly below C2
- 0 = No assessable language

Provide scores in 0.5 increments. Maintain the highest standards.`,

    getUserPrompt: (transcript: string, context: string) => `
Exam Part: ${context}
Candidate Response: "${transcript}"

Evaluate this C2 Proficiency candidate. Return JSON only:
{
  "scores": {
    "grammar": <0-5>,
    "vocabulary": <0-5>,
    "discourse": <0-5>,
    "interaction": <0-5>,
    "globalAchievement": <0-5>
  },
  "analysis": {
    "grammarErrors": [{"error": "...", "correction": "...", "explanation": "...", "severity": "minor|major"}],
    "vocabularyNotes": [{"used": "...", "suggestion": "...", "context": "..."}],
    "discourseAnalysis": "Brief analysis of sophistication, coherence, and rhetorical effectiveness...",
    "interactionAnalysis": "Brief analysis of interaction fluency and subtlety..."
  },
  "feedback": {
    "summary": "Overall assessment in 2-3 sentences...",
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "examplePhrases": ["suggested sophisticated phrase 1", "suggested sophisticated phrase 2"]
  }
}`,
  },
};

// Grading schema for structured outputs
export const GRADING_SCHEMA = {
  name: 'exam_grading',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      scores: {
        type: 'object',
        properties: {
          grammar: { type: 'number' },
          vocabulary: { type: 'number' },
          discourse: { type: 'number' },
          interaction: { type: 'number' },
          globalAchievement: { type: 'number' },
        },
        required: ['grammar', 'vocabulary', 'discourse', 'interaction', 'globalAchievement'],
      },
      analysis: {
        type: 'object',
        properties: {
          grammarErrors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                error: { type: 'string' },
                correction: { type: 'string' },
                explanation: { type: 'string' },
                severity: { type: 'string', enum: ['minor', 'major'] },
              },
              required: ['error', 'correction', 'severity'],
            },
          },
          vocabularyNotes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                used: { type: 'string' },
                suggestion: { type: 'string' },
                context: { type: 'string' },
              },
              required: ['used', 'suggestion'],
            },
          },
          discourseAnalysis: { type: 'string' },
          interactionAnalysis: { type: 'string' },
        },
        required: ['grammarErrors', 'vocabularyNotes', 'discourseAnalysis', 'interactionAnalysis'],
      },
      feedback: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
          examplePhrases: { type: 'array', items: { type: 'string' } },
        },
        required: ['summary', 'strengths', 'improvements'],
      },
    },
    required: ['scores', 'analysis', 'feedback'],
  },
} as const;
