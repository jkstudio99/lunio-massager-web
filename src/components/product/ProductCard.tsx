import { Link } from 'react-router-dom';
import { Star, ArrowRight, ShoppingBag, Check, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useI18n } from '@/store/i18n';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const isInCart = useCartStore((s) => s.items.some((item) => item.product.id === product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const { t } = useI18n();
  const discount = product.comparePrice ? product.comparePrice - product.price : 0;

  const handleCartAction = () => {
    addItem(product);
    openDrawer();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] as const }}
      className="group overflow-hidden rounded-[28px] border border-default bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-surface-alt">
        {product.comparePrice && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-brand/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
            Sale
          </span>
        )}
        {product.isNew && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand backdrop-blur-sm">
            New
          </span>
        )}
        <motion.button
          whileTap={{ scale: 1.3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute ${product.isNew ? 'right-4 top-14' : 'right-4 top-4'} z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
            isInWishlist
              ? 'bg-red-500/90 text-white'
              : 'bg-white/80 text-secondary hover:bg-white hover:text-red-500'
          }`}
          aria-label={isInWishlist ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist}
        >
          <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
        </motion.button>
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link to={`/product/${product.slug}`}>
              <h3 className="line-clamp-2 text-base sm:text-lg font-bold tracking-[-0.02em] text-primary transition-colors group-hover:text-crocus leading-tight">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-crocus/70">
              {product.nameEn}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? 'fill-crocus text-crocus' : 'text-light-gray'}
                  />
                ))}
              </div>
            )}
            <span className="text-[11px] text-muted">{product.reviewCount} {t.product.ratingLabel}</span>
          </div>
        </div>

        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-secondary">
          {product.shortDescription || product.description}
        </p>

        <div className="mb-5 flex items-baseline gap-2">
          {product.comparePrice && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
          <span className="text-2xl font-bold tracking-[-0.03em] text-primary">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-crocus/10 px-2.5 py-1 text-[11px] font-semibold text-crocus">
              {t.product.save} {formatPrice(discount)}
            </span>
          )}
        </div>

        <p className="mb-5 text-xs text-success">
          {t.product.yearWarranty} · {t.product.freeShipping}
        </p>

        <div className="mt-auto flex gap-2">
          <Link
            to={`/product/${product.slug}`}
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-default px-4 py-2 text-xs sm:text-sm font-medium text-primary transition-colors hover:border-crocus hover:text-crocus"
          >
            {t.sections.viewDetail}
            <ArrowRight size={14} className="shrink-0" />
          </Link>
          <button
            onClick={handleCartAction}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-medium text-white transition-all ${
              isInCart ? 'bg-crocus hover:bg-crocus-hover' : 'bg-brand hover:bg-crocus'
            }`}
          >
            {isInCart ? <Check size={14} className="shrink-0" /> : <ShoppingBag size={14} className="shrink-0" />}
            {isInCart ? t.product.addedToCart : t.product.addToCart}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
