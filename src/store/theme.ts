import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
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
        const current = get().theme;
        const next: Theme = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        set({ theme: next });
      },
      initTheme: () => {
        const theme = get().theme;
        applyTheme(theme);

        // Listen for system preference changes when in 'system' mode
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', () => {
          if (get().theme === 'system') {
            applyTheme('system');
          }
        });
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

/** Resolved theme for conditional rendering (never 'system') */
export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useTheme((s) => s.theme);
  if (theme === 'system') return getSystemTheme();
  return theme;
}
