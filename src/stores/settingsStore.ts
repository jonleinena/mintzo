import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExamLevel } from '@/types/exam';

interface ProfileSettings {
  targetExamLevel: ExamLevel;
  targetExamDate: string | null;
  dailyPracticeGoal: number;
  onboardingComplete: boolean;
}

interface SettingsState extends ProfileSettings {
  setTargetExamLevel: (level: ExamLevel) => void;
  setTargetExamDate: (date: string | null) => void;
  setDailyPracticeGoal: (minutes: number) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setSettingsFromProfile: (settings: ProfileSettings) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: ProfileSettings = {
  targetExamLevel: 'B2',
  targetExamDate: null,
  dailyPracticeGoal: 45,
  onboardingComplete: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setTargetExamLevel: (targetExamLevel) => set({ targetExamLevel }),
      setTargetExamDate: (targetExamDate) => set({ targetExamDate }),
      setDailyPracticeGoal: (dailyPracticeGoal) => set({ dailyPracticeGoal }),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      setSettingsFromProfile: (settings) => set(settings),
      resetSettings: () =>
        set((state) => ({
          ...DEFAULT_SETTINGS,
          onboardingComplete: state.onboardingComplete,
        })),
    }),
    {
      name: 'mintzo-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        targetExamLevel: state.targetExamLevel,
        dailyPracticeGoal: state.dailyPracticeGoal,
      }),
    },
  ),
);
