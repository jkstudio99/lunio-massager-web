import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, Shield, Settings } from 'lucide-react';
import { useCookieStore } from '@/store/cookie';
import { useI18n } from '@/store/i18n';
import CookieSettingsModal from './CookieSettingsModal';

export default function CookieBanner() {
  const { locale } = useI18n();
  const { consented, showBanner, acceptAll, rejectAll, openSettings, showSettings } = useCookieStore();

  if (consented && !showSettings) return null;

  return (
    <>
      {/* Banner */}
      <AnimatePresence>
        {showBanner && !consented && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9998] p-4 md:p-6"
          >
            <div className="mx-auto max-w-[1200px] bg-surface-elevated border border-default rounded-2xl shadow-2xl p-5 md:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                {/* Icon + Text */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl bg-crocus/10 shrink-0">
                    <Cookie size={22} className="text-crocus" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-primary mb-1">
                      {locale === 'zh-TW' ? '我們使用 Cookie' : 'We use cookies'}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {locale === 'zh-TW'
                        ? '我們使用 Cookie 和類似技術來提升您的瀏覽體驗、個人化內容和廣告。您可以自由選擇接受或管理您的偏好設定。'
                        : 'We use cookies and similar technologies to enhance your browsing experience, personalize content and ads. You can choose to accept or manage your preferences.'}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
                  <button
                    onClick={openSettings}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-secondary bg-surface-alt hover:bg-light-gray border border-default rounded-lg transition-colors"
                  >
                    <Settings size={14} />
                    {locale === 'zh-TW' ? '管理' : 'Manage'}
                  </button>
                  <button
                    onClick={rejectAll}
                    className="px-4 py-2.5 text-xs font-medium text-secondary hover:text-primary border border-default rounded-lg transition-colors"
                  >
                    {locale === 'zh-TW' ? '僅必要' : 'Reject'}
                  </button>
                  <button
                    onClick={acceptAll}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-crocus hover:bg-crocus-hover rounded-lg transition-colors"
                  >
                    <Shield size={14} />
                    {locale === 'zh-TW' ? '全部接受' : 'Accept All'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <CookieSettingsModal />
    </>
  );
}
