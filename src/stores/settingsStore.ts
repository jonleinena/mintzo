import { create } from 'zustand';
import type { ExamLevel } from '@/types/exam';

interface SettingsState {
  targetExamLevel: ExamLevel;
  targetExamDate: string | null;
  dailyPracticeGoal: number;
  onboardingComplete: boolean;
  setTargetExamLevel: (level: ExamLevel) => void;
  setTargetExamDate: (date: string | null) => void;
  setDailyPracticeGoal: (minutes: number) => void;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  targetExamLevel: 'B2',
  targetExamDate: null,
  dailyPracticeGoal: 45,
  onboardingComplete: false,
  setTargetExamLevel: (targetExamLevel) => set({ targetExamLevel }),
  setTargetExamDate: (targetExamDate) => set({ targetExamDate }),
  setDailyPracticeGoal: (dailyPracticeGoal) => set({ dailyPracticeGoal }),
  setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
}));
