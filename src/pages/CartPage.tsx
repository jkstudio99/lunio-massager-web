import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-alt flex items-center justify-center">
            <ShoppingBag size={32} className="text-muted" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">您的購物車是空的</h2>
          <p className="text-muted mb-8">探索我們的產品，找到最適合您的按摩器</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all"
          >
            開始選購
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const shippingFee = totalPrice() >= 1500 ? 0 : 100;

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-8 lg:py-12 pb-28 lg:pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-bold text-primary mb-8"
        >
          購物車 ({items.length})
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 bg-surface-alt rounded-xl"
              >
                <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="text-sm font-semibold text-primary hover:text-crocus transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted mt-0.5">{item.product.shortDescription}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="flex-shrink-0 p-1.5 text-muted hover:text-alert transition-colors"
                      aria-label="移除商品"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div className="flex items-center border border-default rounded-full bg-surface">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-secondary hover:bg-light-gray transition-colors rounded-l-full"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-secondary hover:bg-light-gray transition-colors rounded-r-full"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-between pt-4">
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} /> 繼續購物
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-muted hover:text-alert transition-colors"
              >
                清空購物車
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-surface-alt rounded-2xl">
              <h2 className="text-lg font-semibold text-primary mb-6">訂單摘要</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">商品小計</span>
                  <span className="font-medium">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">運費</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-success">免運費</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[11px] text-crocus">
                    再消費 {formatPrice(1500 - totalPrice())} 即可免運
                  </p>
                )}
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="輸入優惠碼"
                  className="flex-1 h-10 px-3 bg-surface border border-default rounded-full text-sm focus:outline-none focus:border-crocus"
                />
                <button className="h-10 px-4 bg-brand text-white text-sm font-medium rounded-full hover:bg-charcoal transition-colors">
                  套用
                </button>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-default mb-6">
                <span className="text-sm font-semibold text-primary">合計</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(totalPrice() + shippingFee)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 h-12 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all hover:scale-[1.01]"
              >
                前往結帳
                <ArrowRight size={18} />
              </Link>

              <p className="text-[10px] text-muted text-center mt-4">
                結帳即表示您同意我們的服務條款與隱私權政策
              </p>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-surface/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium tracking-[0.24em] uppercase text-muted">合計</p>
              <p className="text-lg font-bold text-primary">{formatPrice(totalPrice() + shippingFee)}</p>
            </div>
            <Link
              to="/checkout"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-crocus px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-crocus-hover"
            >
              前往結帳
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
