import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CookiePreferences {
  necessary: boolean;   // Always true, can't be disabled
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieState {
  consented: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Partial<CookiePreferences>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  resetConsent: () => void;
}

export const useCookieStore = create<CookieState>()(
  persist(
    (set) => ({
      consented: false,
      preferences: {
        necessary: true,
        analytics: false,
        marketing: false,
        personalization: false,
      },
      showBanner: true,
      showSettings: false,

      acceptAll: () =>
        set({
          consented: true,
          showBanner: false,
          preferences: {
            necessary: true,
            analytics: true,
            marketing: true,
            personalization: true,
          },
        }),

      rejectAll: () =>
        set({
          consented: true,
          showBanner: false,
          preferences: {
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: false,
          },
        }),

      savePreferences: (prefs) =>
        set((state) => ({
          consented: true,
          showBanner: false,
          showSettings: false,
          preferences: { ...state.preferences, ...prefs, necessary: true },
        })),

      openSettings: () => set({ showSettings: true }),
      closeSettings: () => set({ showSettings: false }),

      resetConsent: () =>
        set({
          consented: false,
          showBanner: true,
          preferences: {
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: false,
          },
        }),
    }),
    {
      name: 'lunio-cookie-consent',
      partialize: (state) => ({
        consented: state.consented,
        preferences: state.preferences,
        showBanner: !state.consented,
      }),
    }
  )
);
