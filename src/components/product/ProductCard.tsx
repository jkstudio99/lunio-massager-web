import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useI18n } from '@/store/i18n';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { t } = useI18n();
  const discount = product.comparePrice
    ? product.comparePrice - product.price
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <div className="group bg-surface border border-default hover:border-crocus/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
        {/* Image */}
        <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-[#f5f5f5] p-6">
          {/* Sale badge */}
          {product.comparePrice && (
            <span className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-brand text-white text-xs font-bold uppercase tracking-wider">
              Sale
            </span>
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Info */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Product name */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-primary mb-2 group-hover:text-crocus transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted/30'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-secondary mb-4 line-clamp-3 leading-relaxed">
            {product.description}
          </p>

          {/* Pricing */}
          <div className="mb-4 mt-auto">
            <div className="flex items-baseline gap-2 mb-1">
              {product.comparePrice && (
                <span className="text-xs sm:text-sm text-muted line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              <span className="text-lg sm:text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Discount amount */}
            {discount > 0 && (
              <p className="text-sm sm:text-base font-bold text-alert mt-1">
                {t.product.save} {formatPrice(discount)}
              </p>
            )}

            {/* Warranty + Free shipping */}
            <p className="text-xs text-success mt-2">
              {t.product.yearWarranty} · {t.product.freeShipping}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 mt-2">
            <Link
              to={`/product/${product.slug}`}
              className="flex-1 text-center px-3 sm:px-4 py-2.5 sm:py-3 border border-default text-xs sm:text-sm font-medium text-primary hover:border-crocus hover:text-crocus transition-colors"
            >
              {t.sections.viewDetail}
            </Link>
            <button
              onClick={() => addItem(product)}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-brand hover:bg-crocus text-white text-xs sm:text-sm font-medium transition-colors"
            >
              {t.product.addToCart}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
