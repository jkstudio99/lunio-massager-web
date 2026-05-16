import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '@/store/toast';

const icons = {
  success: { Icon: CheckCircle, color: 'text-emerald-500' },
  error: { Icon: AlertCircle, color: 'text-red-500' },
  info: { Icon: Info, color: 'text-blue-500' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { Icon, color } = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-3 bg-surface border border-default rounded-xl shadow-lg px-4 py-3 min-w-[260px] max-w-[360px]"
            >
              <Icon size={18} className={`${color} shrink-0`} />
              <p className="flex-1 text-sm text-primary">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted hover:text-primary transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
