import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useI18n } from '@/store/i18n';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { t } = useI18n();
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt mb-6">
          <Heart size={36} className="text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">{t.wishlist.empty}</h2>
        <p className="text-secondary text-sm mb-8 text-center max-w-md">{t.wishlist.emptyDesc}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all"
        >
          {t.wishlist.browseProducts}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10 lg:py-16">
      <h1 className="text-3xl font-bold text-primary mb-8 tracking-[-0.02em]">{t.wishlist.title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group overflow-hidden rounded-[28px] border border-default bg-surface shadow-sm"
          >
            <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-surface-alt">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </Link>

            <div className="p-5">
              <Link to={`/product/${product.slug}`}>
                <h3 className="line-clamp-2 text-base font-bold text-primary mb-1 group-hover:text-crocus transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-crocus/70 mb-3">
                {product.nameEn}
              </p>
              <p className="text-xl font-bold text-primary mb-4">{formatPrice(product.price)}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToCart(product);
                    openDrawer();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-crocus hover:bg-crocus-hover text-white text-xs sm:text-sm font-medium py-2.5 px-3 transition-colors"
                >
                  <ShoppingBag size={14} />
                  {t.wishlist.addToCart}
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-default text-muted hover:text-red-500 hover:border-red-300 transition-colors"
                  aria-label={t.wishlist.removeFromWishlist}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
