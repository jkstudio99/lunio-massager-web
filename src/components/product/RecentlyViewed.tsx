import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecentlyViewedStore } from '@/store/recentlyViewed';
import { useI18n } from '@/store/i18n';
import { formatPrice } from '@/lib/utils';

interface Props {
  excludeId?: string;
}

export default function RecentlyViewed({ excludeId }: Props) {
  const { t } = useI18n();
  const items = useRecentlyViewedStore((s) => s.items);

  const filtered = excludeId ? items.filter((i) => i.id !== excludeId) : items;
  if (filtered.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold text-primary mb-6"
        >
          {t.product.recentlyViewed}
        </motion.h2>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="shrink-0 snap-start"
            >
              <Link
                to={`/product/${item.slug}`}
                className="block w-40 group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-alt border border-default mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-primary truncate group-hover:text-crocus transition-colors">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-primary">{formatPrice(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-muted line-through">{formatPrice(item.originalPrice)}</span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
