import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, ChevronDown, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/data/products';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types/product';

type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc';

import { useI18n } from '@/store/i18n';

export default function ProductListPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const activeCategory = searchParams.get('category') as ProductCategory | null;

  const activeCategoryData = activeCategory
    ? categories.find((c) => c.id === activeCategory)
    : null;

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }, [activeCategory, sortBy]);

  const setCategory = (cat: ProductCategory | null) => {
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="absolute inset-0">
          <img
            src={activeCategoryData?.image ?? '/images/categories/boot.jpg'}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/80 to-brand/55" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/55 mb-4">
              Collections
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-[-0.03em] leading-tight mb-5">
              {activeCategoryData ? t.categories[activeCategoryData.id as keyof typeof t.categories] : t.nav.products}
            </h1>
            <h2 className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              {activeCategoryData ? t.sections.categoriesDesc : t.footer.tagline}
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCategory(null)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-colors',
                  !activeCategory
                    ? 'bg-crocus text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                )}
              >
                {t.common.all}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'px-5 py-2.5 rounded-full text-sm font-medium transition-colors',
                    activeCategory === cat.id
                      ? 'bg-crocus text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  )}
                >
                  {t.categories[cat.id as keyof typeof t.categories]}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24 rounded-3xl border border-default bg-surface-alt p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                {t.common.productCategory}
              </h3>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                <button
                  onClick={() => setCategory(null)}
                  className={cn(
                    'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    !activeCategory
                      ? 'bg-brand text-white'
                      : 'bg-surface text-secondary hover:bg-light-gray'
                  )}
                >
                  {t.common.all}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                      activeCategory === cat.id
                        ? 'bg-brand text-white'
                        : 'bg-surface text-secondary hover:bg-light-gray'
                    )}
                  >
                    {t.categories[cat.id as keyof typeof t.categories]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-default">
              <p className="text-sm text-muted">
                {t.common.showingItems} <span className="font-semibold text-primary">{filtered.length}</span> {t.common.items}
              </p>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <div className="relative min-w-[140px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-surface-alt text-sm font-medium text-secondary pl-3 pr-8 py-2 rounded-full cursor-pointer focus:outline-none"
                  >
                    <option value="popular">{t.common.sortByPopular}</option>
                    <option value="newest">{t.common.sortByNewest}</option>
                    <option value="price-asc">{t.common.sortByPriceAsc}</option>
                    <option value="price-desc">{t.common.sortByPriceDesc}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
                </div>
                <div className="hidden sm:flex border border-default rounded-lg overflow-hidden bg-surface-alt">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-brand text-white' : 'text-muted hover:bg-surface')}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-brand text-white' : 'text-muted hover:bg-surface')}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div
              className={cn(
                'grid gap-4 sm:gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted">{t.common.noProducts}</p>
                <button
                  onClick={() => setCategory(null)}
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-crocus hover:text-crocus-hover transition-colors"
                >
                  {t.product.backToProducts} <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

