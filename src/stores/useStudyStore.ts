import { create } from 'zustand';

interface StudyStoreState {
  // Theme state
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;

  // Flashcards state: array of card IDs that are currently flipped
  flippedCards: string[];
  toggleCardFlip: (cardId: string) => void;
  resetFlippedCards: () => void;

  // Active Flashcard index for slider/navigation
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  nextCard: (total: number) => void;
  prevCard: () => void;

  // Quiz state
  selectedAnswers: Record<number, string>;
  selectAnswer: (questionIndex: number, answer: string) => void;
  resetQuizAnswers: () => void;
}

// Check initial dark mode from DOM or localStorage
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('study_buddy_dark_mode');
  if (saved !== null) {
    const isDark = saved === 'true';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    return isDark;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  return prefersDark;
};

export const useStudyStore = create<StudyStoreState>((set) => ({
  isDarkMode: getInitialDarkMode(),

  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('study_buddy_dark_mode', String(newDarkMode));
        document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
      }
      return { isDarkMode: newDarkMode };
    }),

  setDarkMode: (value) =>
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('study_buddy_dark_mode', String(value));
        document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
      }
      return { isDarkMode: value };
    }),

  // Flipped cards array of IDs
  flippedCards: [],

  toggleCardFlip: (cardId: string) =>
    set((state) => {
      const isAlreadyFlipped = state.flippedCards.includes(cardId);
      const newFlippedCards = isAlreadyFlipped
        ? state.flippedCards.filter((id) => id !== cardId)
        : [...state.flippedCards, cardId];
      return { flippedCards: newFlippedCards };
    }),

  resetFlippedCards: () => set({ flippedCards: [] }),

  activeCardIndex: 0,
  setActiveCardIndex: (index) => set({ activeCardIndex: index }),
  nextCard: (total) =>
    set((state) => ({
      activeCardIndex: state.activeCardIndex < total - 1 ? state.activeCardIndex + 1 : 0,
    })),
  prevCard: () =>
    set((state) => ({
      activeCardIndex: state.activeCardIndex > 0 ? state.activeCardIndex - 1 : 0,
    })),

  selectedAnswers: {},
  selectAnswer: (questionIndex, answer) =>
    set((state) => ({
      selectedAnswers: { ...state.selectedAnswers, [questionIndex]: answer },
    })),
  resetQuizAnswers: () => set({ selectedAnswers: {} }),
}));
