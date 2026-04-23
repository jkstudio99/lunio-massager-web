import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { cn, formatPrice } from '@/lib/utils';

export default function CartToast() {
  const notice = useCartStore((s) => s.notice);
  const clearNotice = useCartStore((s) => s.clearNotice);
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      clearNotice();
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [notice, clearNotice]);

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className={cn(
            'fixed left-1/2 top-20 z-[90] w-[calc(100%-1.5rem)] max-w-[420px] -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0',
            'rounded-[24px] border border-default bg-surface/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl'
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-alt">
              {notice.product.images?.[0] ? (
                <img src={notice.product.images[0]} alt={notice.product.name} className="h-full w-full object-cover" />
              ) : (
                <ShoppingBag size={18} className="text-muted" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-crocus">
                <Check size={14} />
                已加入購物車
              </div>
              <p className="line-clamp-1 text-sm font-semibold text-primary">{notice.product.name}</p>
              <p className="mt-0.5 text-xs text-muted">
                {notice.quantity} 件 · {formatPrice(notice.product.price * notice.quantity)}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openDrawer}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-crocus"
                >
                  查看購物車
                  <ArrowRight size={14} />
                </button>
                <Link
                  to="/checkout"
                  onClick={clearNotice}
                  className="inline-flex items-center gap-2 rounded-full border border-default px-4 py-2 text-xs font-semibold text-primary transition-colors hover:border-medium-gray"
                >
                  直接結帳
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={clearNotice}
              className="rounded-full p-1.5 text-muted transition-colors hover:text-primary"
              aria-label="關閉通知"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
