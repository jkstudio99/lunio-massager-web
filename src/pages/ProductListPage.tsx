import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/data/products';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types/product';

type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const activeCategory = searchParams.get('category') as ProductCategory | null;

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
      {/* Header */}
      <div className="bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              {activeCategory
                ? categories.find((c) => c.id === activeCategory)?.name ?? '所有產品'
                : '所有產品'}
            </h1>
            <p className="text-muted">
              {activeCategory
                ? categories.find((c) => c.id === activeCategory)?.description
                : '探索我們全系列專業按摩器產品'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                產品分類
              </h3>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                <button
                  onClick={() => setCategory(null)}
                  className={cn(
                    'px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    !activeCategory
                      ? 'bg-brand text-white'
                      : 'bg-surface-alt text-secondary hover:bg-light-gray'
                  )}
                >
                  全部
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                      activeCategory === cat.id
                        ? 'bg-brand text-white'
                        : 'bg-surface-alt text-secondary hover:bg-light-gray'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-default">
              <p className="text-sm text-muted">
                顯示 <span className="font-semibold text-primary">{filtered.length}</span> 件商品
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-surface-alt text-sm font-medium text-secondary pl-3 pr-8 py-2 rounded-full cursor-pointer focus:outline-none"
                  >
                    <option value="popular">依熱門度</option>
                    <option value="newest">依最新</option>
                    <option value="price-asc">價格低到高</option>
                    <option value="price-desc">價格高到低</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
                </div>
                <div className="hidden sm:flex border border-default rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-brand text-white' : 'text-muted hover:bg-surface-alt')}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-brand text-white' : 'text-muted hover:bg-surface-alt')}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div
              className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted">目前此分類沒有產品</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
