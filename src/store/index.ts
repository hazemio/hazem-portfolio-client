import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin } from '../types';

/* ─────────────────────────────────────────────
   THEME STORE
──────────────────────────────────────────── */
interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (t: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme:
        (window.matchMedia?.('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light') as 'dark' | 'light',

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        document.documentElement.classList.toggle('dark', next === 'dark');
      },

      setTheme: (t) => {
        set({ theme: t });
        document.documentElement.classList.toggle('dark', t === 'dark');
      },
    }),
    { name: 'portfolio-theme' }
  )
);

/* ─────────────────────────────────────────────
   AUTH STORE
──────────────────────────────────────────── */
interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;

  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: localStorage.getItem('portfolio_token'),
      admin: null,
      isAuthenticated: !!localStorage.getItem('portfolio_token'),

      login: (token, admin) => {
        localStorage.setItem('portfolio_token', token);
        set({ token, admin, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('portfolio_token');
        set({ token: null, admin: null, isAuthenticated: false });
      },
    }),
    { name: 'portfolio-auth' }
  )
);