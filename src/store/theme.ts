import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light' as Theme,
      setTheme: (theme: Theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next: Theme = get().theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: 'lunio-theme',
      partialize: (state) => ({ theme: state.theme }) as unknown as ThemeState,
      merge: (persisted, current) => {
        const p = persisted as Partial<ThemeState> | undefined;
        const theme = p?.theme ?? current.theme;
        applyTheme(theme);
        return { ...current, theme };
      },
    }
  )
);
