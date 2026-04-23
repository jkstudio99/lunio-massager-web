import { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingContact() {
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
              <h3 className="text-sm font-semibold text-brand">需要幫助嗎？</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-muted hover:text-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-muted mb-4">
              我們的客服團隊隨時為您服務，歡迎透過以下方式聯繫我們
            </p>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#06C755] text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={20} />
                <div>
                  <p className="text-sm font-semibold">LINE 線上客服</p>
                  <p className="text-[10px] opacity-80">@lunio-tw</p>
                </div>
              </a>
              <a
                href="tel:+886222222222"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt text-primary hover:bg-light-gray transition-colors"
              >
                <Phone size={20} />
                <div>
                  <p className="text-sm font-semibold">客服電話</p>
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
              服務時間：週一至週六 09:00-18:00
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-light transition-all hover:scale-105"
        aria-label="聯繫客服"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
