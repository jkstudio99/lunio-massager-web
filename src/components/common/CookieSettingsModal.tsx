import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Shield, Cookie, BarChart3, Megaphone, Sparkles } from 'lucide-react';
import { useCookieStore, type CookiePreferences } from '@/store/cookie';
import { useI18n } from '@/store/i18n';
import { cn } from '@/lib/utils';

interface CookieCategory {
  key: keyof CookiePreferences;
  icon: React.ReactNode;
  title: { 'zh-TW': string; en: string };
  description: { 'zh-TW': string; en: string };
  disabled?: boolean;
}

const categories: CookieCategory[] = [
  {
    key: 'necessary',
    icon: <Shield size={18} />,
    title: { 'zh-TW': '必要 Cookie', en: 'Necessary Cookies' },
    description: {
      'zh-TW': '這些 Cookie 是網站正常運作所必需的，無法關閉。包括安全驗證、購物車功能等。',
      en: 'These cookies are essential for the website to function properly and cannot be disabled. They include security, authentication, and cart functionality.',
    },
    disabled: true,
  },
  {
    key: 'analytics',
    icon: <BarChart3 size={18} />,
    title: { 'zh-TW': '分析 Cookie', en: 'Analytics Cookies' },
    description: {
      'zh-TW': '幫助我們了解訪客如何使用網站，以改善網站效能和使用者體驗。',
      en: 'Help us understand how visitors interact with our website to improve performance and user experience.',
    },
  },
  {
    key: 'marketing',
    icon: <Megaphone size={18} />,
    title: { 'zh-TW': '行銷 Cookie', en: 'Marketing Cookies' },
    description: {
      'zh-TW': '用於追蹤訪客的瀏覽行為，以提供更相關的廣告和推廣內容。',
      en: 'Used to track visitor browsing behavior to deliver more relevant ads and promotional content.',
    },
  },
  {
    key: 'personalization',
    icon: <Sparkles size={18} />,
    title: { 'zh-TW': '個人化 Cookie', en: 'Personalization Cookies' },
    description: {
      'zh-TW': '記住您的偏好設定，如語言、地區和顯示選項，為您提供個人化體驗。',
      en: 'Remember your preferences like language, region, and display options to provide a personalized experience.',
    },
  },
];

export default function CookieSettingsModal() {
  const { locale } = useI18n();
  const { showSettings, closeSettings, preferences, savePreferences, acceptAll, rejectAll } = useCookieStore();
  const [localPrefs, setLocalPrefs] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    if (showSettings) {
      setLocalPrefs(preferences);
    }
  }, [showSettings, preferences]);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return;
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    savePreferences(localPrefs);
  };

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg max-h-[90vh] bg-surface-elevated border border-default rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-default">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-crocus/10 flex items-center justify-center">
                    <Cookie size={18} className="text-crocus" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-primary">
                      {locale === 'zh-TW' ? 'Cookie 偏好設定' : 'Cookie Preferences'}
                    </h2>
                    <p className="text-[11px] text-muted">
                      {locale === 'zh-TW' ? '管理您的隱私偏好' : 'Manage your privacy preferences'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeSettings}
                  className="p-2 text-muted hover:text-primary rounded-lg hover:bg-surface-alt transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.key}
                    className={cn(
                      'p-4 rounded-xl border transition-colors',
                      localPrefs[cat.key]
                        ? 'border-crocus/30 bg-crocus/5'
                        : 'border-default bg-surface-alt'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                          localPrefs[cat.key] ? 'bg-crocus/15 text-crocus' : 'bg-surface text-muted'
                        )}>
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-primary">
                            {cat.title[locale as 'zh-TW' | 'en']}
                          </p>
                          <p className="text-xs text-muted mt-1 leading-relaxed">
                            {cat.description[locale as 'zh-TW' | 'en']}
                          </p>
                        </div>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => handleToggle(cat.key)}
                        disabled={cat.disabled}
                        className={cn(
                          'relative w-11 h-6 rounded-full transition-colors shrink-0 mt-1',
                          cat.disabled && 'opacity-60 cursor-not-allowed',
                          localPrefs[cat.key] ? 'bg-crocus' : 'bg-light-gray'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                            localPrefs[cat.key] && 'translate-x-5'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-default flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => { rejectAll(); closeSettings(); }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-secondary border border-default rounded-lg hover:bg-surface-alt transition-colors"
                >
                  {locale === 'zh-TW' ? '僅必要' : 'Reject All'}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => { acceptAll(); closeSettings(); }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-crocus border border-crocus/30 rounded-lg hover:bg-crocus/5 transition-colors"
                >
                  {locale === 'zh-TW' ? '全部接受' : 'Accept All'}
                </button>
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-crocus hover:bg-crocus-hover rounded-lg transition-colors"
                >
                  {locale === 'zh-TW' ? '儲存偏好' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
