import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import translations, { type Locale } from '@/i18n/translations';

type Translations = (typeof translations)[Locale];

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

function applyLang(locale: Locale) {
  document.documentElement.lang = locale === 'zh-TW' ? 'zh' : locale;
}

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'zh-TW' as Locale,
      setLocale: (locale: Locale) => {
        applyLang(locale);
        set({ locale, t: translations[locale] as Translations });
      },
      t: translations['zh-TW'] as Translations,
    }),
    {
      name: 'lunio-locale',
      partialize: (state) => ({ locale: state.locale }) as unknown as I18nState,
      merge: (persisted, current) => {
        const p = persisted as Partial<I18nState> | undefined;
        const locale = p?.locale ?? current.locale;
        applyLang(locale);
        return {
          ...current,
          locale,
          t: translations[locale] as Translations,
        };
      },
    }
  )
);
