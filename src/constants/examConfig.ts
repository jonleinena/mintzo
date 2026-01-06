// Exam configuration for Cambridge Speaking exams

import type {
  ExamLevel,
  ExamPart,
  ExamPartConfig,
  ExamLevelConfig,
  CambridgeScaleConfig,
} from '@/types/exam';
import type { ConfidenceThreshold, ScoreWeights } from '@/types/scoring';
import { colors } from './Colors';

// Part configurations for each level
const B2_PARTS: ExamPartConfig[] = [
  {
    part: 'part1',
    name: 'Interview',
    duration: 120, // 2 minutes
    isConversational: true,
    hasImages: false,
    description: 'The examiner asks you questions about yourself, your experiences, and future plans.',
  },
  {
    part: 'part2',
    name: 'Long Turn',
    duration: 240, // 4 minutes total (1 min speaking + follow-up)
    isConversational: false,
    hasImages: true,
    description: 'Compare two photographs and answer a question about them. Speak for about 1 minute.',
  },
  {
    part: 'part3',
    name: 'Collaborative Task',
    duration: 180, // 3 minutes
    isConversational: true,
    hasImages: false,
    description: 'Discuss a topic with the AI examiner and try to reach a decision together.',
  },
  {
    part: 'part4',
    name: 'Discussion',
    duration: 240, // 4 minutes
    isConversational: true,
    hasImages: false,
    description: 'Extended discussion on topics related to Part 3.',
  },
];

const C1_PARTS: ExamPartConfig[] = [
  {
    part: 'part1',
    name: 'Interview',
    duration: 120, // 2 minutes
    isConversational: true,
    hasImages: false,
    description: 'Personal information, interests, studies, and career questions.',
  },
  {
    part: 'part2',
    name: 'Long Turn',
    duration: 240, // 4 minutes total
    isConversational: false,
    hasImages: true,
    description: 'You will see three photographs and discuss two of them. Speak for about 1 minute.',
  },
  {
    part: 'part3',
    name: 'Collaborative Task',
    duration: 180, // 3 minutes
    isConversational: true,
    hasImages: false,
    description: 'Discuss written prompts and reach a collaborative decision.',
  },
  {
    part: 'part4',
    name: 'Discussion',
    duration: 300, // 5 minutes
    isConversational: true,
    hasImages: false,
    description: 'Extended discussion on Part 3 themes with examiner questions.',
  },
];

const C2_PARTS: ExamPartConfig[] = [
  {
    part: 'part1',
    name: 'Interview',
    duration: 180, // 3 minutes
    isConversational: true,
    hasImages: false,
    description: 'General conversation and opinions on general topics.',
  },
  {
    part: 'part2',
    name: 'Collaborative Task',
    duration: 240, // 4 minutes
    isConversational: true,
    hasImages: true,
    description: 'Photos as basis for collaborative discussion task.',
  },
  {
    part: 'part3',
    name: 'Long Turn + Discussion',
    duration: 480, // 8 minutes
    isConversational: true,
    hasImages: false,
    description: '2-minute individual speech from prompt card, then discussion on themes.',
  },
];

// Level configurations
export const EXAM_LEVELS: Record<ExamLevel, ExamLevelConfig> = {
  B2: {
    level: 'B2',
    name: 'B2 First (FCE)',
    totalDuration: 780, // 13 minutes (solo practice)
    parts: B2_PARTS,
    color: colors.exam.b2,
  },
  C1: {
    level: 'C1',
    name: 'C1 Advanced (CAE)',
    totalDuration: 840, // 14 minutes (solo practice)
    parts: C1_PARTS,
    color: colors.exam.c1,
  },
  C2: {
    level: 'C2',
    name: 'C2 Proficiency (CPE)',
    totalDuration: 900, // 15 minutes (solo practice)
    parts: C2_PARTS,
    color: colors.exam.c2,
  },
};

// Cambridge Scale configuration
export const CAMBRIDGE_SCALE: Record<ExamLevel, CambridgeScaleConfig> = {
  B2: { min: 140, max: 190, pass: 160, gradeB: 173, gradeA: 180 },
  C1: { min: 160, max: 210, pass: 180, gradeB: 193, gradeA: 200 },
  C2: { min: 180, max: 230, pass: 200, gradeB: 213, gradeA: 220 },
};

// Score weights for final calculation
export const SCORE_WEIGHTS: ScoreWeights = {
  grammar: 0.20,
  vocabulary: 0.20,
  discourse: 0.20,
  pronunciation: 0.15,
  interaction: 0.15,
  globalAchievement: 0.10,
};

// STT confidence thresholds by level (higher levels = stricter)
export const CONFIDENCE_THRESHOLDS: Record<ExamLevel, ConfidenceThreshold> = {
  B2: { flag: 0.70, severe: 0.50 }, // More lenient
  C1: { flag: 0.75, severe: 0.55 },
  C2: { flag: 0.80, severe: 0.60 }, // Strictest
};

// Part order by level
export const PART_ORDER: Record<ExamLevel, ExamPart[]> = {
  B2: ['part1', 'part2', 'part3', 'part4'],
  C1: ['part1', 'part2', 'part3', 'part4'],
  C2: ['part1', 'part2', 'part3'], // C2 only has 3 parts
};

// Helper functions
export function getPartConfig(level: ExamLevel, part: ExamPart): ExamPartConfig | undefined {
  return EXAM_LEVELS[level].parts.find((p) => p.part === part);
}

export function getNextPart(level: ExamLevel, currentPart: ExamPart): ExamPart | null {
  const parts = PART_ORDER[level];
  const currentIndex = parts.indexOf(currentPart);
  if (currentIndex === -1 || currentIndex === parts.length - 1) {
    return null;
  }
  return parts[currentIndex + 1];
}

export function isLastPart(level: ExamLevel, part: ExamPart): boolean {
  const parts = PART_ORDER[level];
  return parts[parts.length - 1] === part;
}

export function getTotalParts(level: ExamLevel): number {
  return PART_ORDER[level].length;
}
