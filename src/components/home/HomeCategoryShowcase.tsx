import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomeCategoryShowcase() {
  const { t } = useI18n();

  return (
    <section className="py-14 sm:py-20 lg:py-32 transition-colors bg-surface-alt">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <motion.div {...fadeInUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 sm:mb-14">
          <div className="max-w-2xl px-2 sm:px-0">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-2 sm:mb-3">Collections</p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">{t.sections.categories}</h2>
            <p className="text-sm sm:text-base text-secondary mt-4 leading-relaxed">{t.sections.categoriesDesc}</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-muted hover:text-crocus transition-colors"
          >
            {t.sections.viewAll} <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
            >
              <Link
                to={`/products?category=${category.slug}`}
                className="group relative block overflow-hidden rounded-[28px] bg-surface border border-default shadow-sm"
              >
                <div className="relative aspect-[16/11] sm:aspect-[4/5] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/55 mb-2">Collection</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-white/75 leading-relaxed max-w-xs">{category.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-white/80 group-hover:text-crocus transition-colors">
                    {t.sections.viewDetail}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
