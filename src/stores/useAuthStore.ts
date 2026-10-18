import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('ai_study_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('ai_study_token') || null,
  isAuthenticated: !!localStorage.getItem('ai_study_token'),
  isLoading: false,

  setAuth: (token: string, user: User) => {
    localStorage.setItem('ai_study_token', token);
    localStorage.setItem('ai_study_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('ai_study_token');
    localStorage.removeItem('ai_study_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem('ai_study_token');
    const storedUser = localStorage.getItem('ai_study_user');
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ token, user, isAuthenticated: true });
      } catch {
        localStorage.removeItem('ai_study_token');
        localStorage.removeItem('ai_study_user');
        set({ token: null, user: null, isAuthenticated: false });
      }
    } else {
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));
