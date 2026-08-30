import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProgressState {
  // Vernier Caliper Modules
  vernier_materi_1: boolean;
  vernier_materi_2: boolean;
  vernier_simulasi: boolean;
  vernier_latihan: boolean;

  // Micrometer Modules
  micrometer_materi_1: boolean;
  micrometer_materi_2: boolean;
  micrometer_simulasi: boolean;
  micrometer_latihan: boolean;

  // Quiz States
  main_quiz_completed: boolean;
  main_quiz_score: number | null;
  main_quiz_attempts: number;

  // Actions
  completeModule: (moduleKey: keyof Omit<ProgressState, 'completeModule' | 'isMainQuizUnlocked' | 'resetProgress' | 'unlockAllForDemo'>) => void;
  setMainQuizCompleted: (score: number) => void;
  incrementMainQuizAttempts: (score: number) => void;
  isMainQuizUnlocked: () => boolean;
  getCompletedCount: () => { completed: number; total: number };
  unlockAllForDemo: () => void;
  resetProgress: () => void;
}

const initialProgress = {
  vernier_materi_1: false,
  vernier_materi_2: false,
  vernier_simulasi: false,
  vernier_latihan: false,

  micrometer_materi_1: false,
  micrometer_materi_2: false,
  micrometer_simulasi: false,
  micrometer_latihan: false,

  main_quiz_completed: false,
  main_quiz_score: null,
  main_quiz_attempts: 0,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgress,

      completeModule: (moduleKey) => {
        set((state) => ({ ...state, [moduleKey]: true }));
      },

      setMainQuizCompleted: (score) => {
        set((state) => ({
          main_quiz_completed: true,
          main_quiz_score: state.main_quiz_score === null ? score : Math.max(state.main_quiz_score, score),
          main_quiz_attempts: (state.main_quiz_attempts || 0) + 1,
        }));
      },

      incrementMainQuizAttempts: (score) => {
        set((state) => ({
          main_quiz_completed: true,
          main_quiz_score: state.main_quiz_score === null ? score : Math.max(state.main_quiz_score, score),
          main_quiz_attempts: (state.main_quiz_attempts || 0) + 1,
        }));
      },

      isMainQuizUnlocked: () => {
        const state = get();
        return (
          state.vernier_materi_1 &&
          state.vernier_materi_2 &&
          state.vernier_simulasi &&
          state.vernier_latihan &&
          state.micrometer_materi_1 &&
          state.micrometer_materi_2 &&
          state.micrometer_simulasi &&
          state.micrometer_latihan
        );
      },

      getCompletedCount: () => {
        const state = get();
        const modules = [
          state.vernier_materi_1,
          state.vernier_materi_2,
          state.vernier_simulasi,
          state.vernier_latihan,
          state.micrometer_materi_1,
          state.micrometer_materi_2,
          state.micrometer_simulasi,
          state.micrometer_latihan,
        ];
        const completed = modules.filter(Boolean).length;
        return { completed, total: 8 };
      },

      unlockAllForDemo: () => {
        set({
          vernier_materi_1: true,
          vernier_materi_2: true,
          vernier_simulasi: true,
          vernier_latihan: true,
          micrometer_materi_1: true,
          micrometer_materi_2: true,
          micrometer_simulasi: true,
          micrometer_latihan: true,
        });
      },

      resetProgress: () => set(initialProgress),
    }),
    {
      name: 'alatukur-progress-storage',
    }
  )
);
