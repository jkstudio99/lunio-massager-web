import { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useI18n } from '@/store/i18n';

export default function FloatingContact() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-elevated rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-5 w-72 mb-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-brand">{t.common.needHelp}</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-muted hover:text-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-muted mb-4">
              {t.common.supportDesc}
            </p>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#06C755] text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={20} />
                <div>
                  <p className="text-sm font-semibold">{t.common.lineSupport}</p>
                  <p className="text-[10px] opacity-80">@lunio-tw</p>
                </div>
              </a>
              <a
                href="tel:+886222222222"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt text-primary hover:bg-light-gray transition-colors"
              >
                <Phone size={20} />
                <div>
                  <p className="text-sm font-semibold">{t.common.phoneSupport}</p>
                  <p className="text-[10px] text-muted">02-2xxx-xxxx</p>
                </div>
              </a>
              <a
                href="mailto:support@lunio.com.tw"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt text-primary hover:bg-light-gray transition-colors"
              >
                <Mail size={20} />
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-[10px] text-muted">support@lunio.com.tw</p>
                </div>
              </a>
            </div>
            <p className="text-[10px] text-muted text-center mt-3">
              {t.common.serviceHours}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-light transition-all hover:scale-105"
        aria-label={t.common.contactAria}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

