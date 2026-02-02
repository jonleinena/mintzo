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
  setSettingsFromProfile: (settings: {
    targetExamLevel: ExamLevel;
    targetExamDate: string | null;
    dailyPracticeGoal: number;
    onboardingComplete: boolean;
  }) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  targetExamLevel: 'B2' as ExamLevel,
  targetExamDate: null,
  dailyPracticeGoal: 45,
  onboardingComplete: false,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_SETTINGS,
  setTargetExamLevel: (targetExamLevel) => set({ targetExamLevel }),
  setTargetExamDate: (targetExamDate) => set({ targetExamDate }),
  setDailyPracticeGoal: (dailyPracticeGoal) => set({ dailyPracticeGoal }),
  setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
  setSettingsFromProfile: (settings) => set({ ...settings }),
  resetSettings: () => set({ ...DEFAULT_SETTINGS }),
}));
