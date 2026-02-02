import { create } from 'zustand';
import type { ExamLevel, ExamPart, ExamSession } from '@/types/exam';

interface ExamState {
  currentSession: ExamSession | null;
  currentPart: ExamPart | null;
  setCurrentSession: (session: ExamSession | null) => void;
  setCurrentPart: (part: ExamPart | null) => void;
  reset: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  currentSession: null,
  currentPart: null,
  setCurrentSession: (currentSession) => set({ currentSession }),
  setCurrentPart: (currentPart) => set({ currentPart }),
  reset: () => set({ currentSession: null, currentPart: null }),
}));
