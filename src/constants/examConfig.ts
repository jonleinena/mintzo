import type { ExamLevel } from '@/types/exam';

export const EXAM_CONFIG = {
  B2: {
    name: 'B2 First (FCE)',
    parts: ['part1', 'part2', 'part3', 'part4'] as const,
    totalDuration: 14,
    partDurations: {
      part1: 2,
      part2: 4,
      part3: 3,
      part4: 4,
    },
    part2Photos: 2,
  },
  C1: {
    name: 'C1 Advanced (CAE)',
    parts: ['part1', 'part2', 'part3', 'part4'] as const,
    totalDuration: 15,
    partDurations: {
      part1: 2,
      part2: 4,
      part3: 3,
      part4: 5,
    },
    part2Photos: 3,
  },
  C2: {
    name: 'C2 Proficiency (CPE)',
    parts: ['part1', 'part2', 'part3'] as const,
    totalDuration: 16,
    partDurations: {
      part1: 3,
      part2: 4,
      part3: 8,
    },
    part2Photos: 0,
  },
} as const;

export const CAMBRIDGE_SCALE = {
  B2: { min: 140, max: 190, pass: 160, gradeB: 173, gradeA: 180 },
  C1: { min: 160, max: 210, pass: 180, gradeB: 193, gradeA: 200 },
  C2: { min: 180, max: 230, pass: 200, gradeB: 213, gradeA: 220 },
} as const;

export const DAILY_LIMIT_MINUTES = 45;

export const FREE_TRIAL_KEY = 'mintzo_free_trial_used';
