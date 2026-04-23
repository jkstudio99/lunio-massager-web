import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomeProductsSection() {
  const { t } = useI18n();
  const featured = products.filter((p) => p.isBestSeller);

  return (
    <section className="py-16 lg:py-28 bg-surface transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div {...fadeInUp} className="flex items-end justify-between mb-8 sm:mb-14">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-2 sm:mb-3">Popular</p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">{t.sections.bestSellers}</h2>
            <p className="text-sm sm:text-base text-secondary mt-4 leading-relaxed">{t.sections.bestSellersDesc}</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-muted hover:text-crocus transition-colors"
          >
            {t.sections.viewAll} <ChevronRight size={16} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
