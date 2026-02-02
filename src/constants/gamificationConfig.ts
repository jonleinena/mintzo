export const XP_CONFIG = {
  fullExam: 100,
  singlePart: 30,
  dailyBonus: 20,
  scoreExcellent: 1.5,
  scoreGood: 1.2,
  scoreAverage: 1.0,
  streak7Days: 1.1,
  streak30Days: 1.25,
  streak100Days: 1.5,
} as const;

export const LEVELS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 16500, 20500, 25000, 30000, 36000, 43000, 51000, 60000,
] as const;

export const ACTIVITY_LEVELS = {
  0: { min: 0, max: 0, label: 'No activity' },
  1: { min: 1, max: 10, label: 'Light' },
  2: { min: 11, max: 25, label: 'Moderate' },
  3: { min: 26, max: 40, label: 'Active' },
  4: { min: 41, max: 45, label: 'Maximum' },
} as const;
