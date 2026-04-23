import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, totalPrice, totalItems } = useCartStore();

  const shippingFee = totalPrice() >= 1500 ? 0 : 100;
  const total = totalPrice() + shippingFee;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };

    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.button
            type="button"
            aria-label="關閉購物車"
            className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-[460px] flex-col border-l border-default bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-default px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-crocus">Mini Cart</p>
                <h2 className="text-lg font-bold tracking-[-0.03em] text-primary">購物車預覽</h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-default text-muted transition-colors hover:border-medium-gray hover:text-primary"
                aria-label="關閉"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
                    <ShoppingBag size={26} className="text-muted" />
                  </div>
                  <p className="text-lg font-semibold text-primary">購物車目前是空的</p>
                  <p className="mt-2 max-w-xs text-sm text-muted">先去逛逛產品，挑好後再回來結帳。</p>
                  <Link
                    to="/products"
                    onClick={closeDrawer}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-crocus px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crocus-hover"
                  >
                    瀏覽產品
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="rounded-2xl border border-default bg-surface-alt p-4">
                      <div className="flex gap-3">
                        <Link to={`/product/${item.product.slug}`} onClick={closeDrawer} className="shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                to={`/product/${item.product.slug}`}
                                onClick={closeDrawer}
                                className="line-clamp-2 text-sm font-semibold text-primary transition-colors hover:text-crocus"
                              >
                                {item.product.name}
                              </Link>
                              <p className="mt-1 text-xs text-muted">{item.product.shortDescription}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="rounded-full p-1 text-muted transition-colors hover:text-alert"
                              aria-label="移除商品"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="flex items-center overflow-hidden rounded-full border border-default bg-surface">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="flex h-9 w-9 items-center justify-center text-secondary transition-colors hover:bg-surface-alt"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center text-sm font-semibold text-primary">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="flex h-9 w-9 items-center justify-center text-secondary transition-colors hover:bg-surface-alt"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-[11px] text-muted">小計</p>
                              <p className="text-sm font-semibold text-primary">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-default bg-surface px-5 py-5">
              <div className="mb-4 rounded-2xl bg-surface-alt p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">商品數量</span>
                  <span className="font-semibold text-primary">{totalItems()}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-secondary">商品小計</span>
                  <span className="font-semibold text-primary">{formatPrice(totalPrice())}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-secondary">運費</span>
                  <span className="font-semibold text-primary">{shippingFee === 0 ? <span className="text-success">免運費</span> : formatPrice(shippingFee)}</span>
                </div>
                <div className="mt-3 border-t border-default pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">合計</span>
                  <span className="text-2xl font-bold tracking-[-0.03em] text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-default px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-medium-gray"
                >
                  繼續購物
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    navigate('/checkout');
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-crocus px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-crocus/20 transition-all hover:bg-crocus-hover"
                >
                  前往結帳
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted">
                <Check size={14} className="text-success" />
                結帳流程已準備好，現在可以直接完成購買
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
