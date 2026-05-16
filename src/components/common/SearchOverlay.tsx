import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '@/store/search';
import { useI18n } from '@/store/i18n';
import { products } from '@/data/products';
import { blogPosts } from '@/data/blog';
import { formatPrice } from '@/lib/utils';

export default function SearchOverlay() {
  const { isOpen, query, closeSearch, setQuery } = useSearchStore();
  const { t, locale } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useSearchStore.getState().openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const lowerQuery = query.toLowerCase().trim();

  const productResults = useMemo(() => {
    if (!lowerQuery) return [];
    return products
      .filter((p) => {
        const name = locale === 'en' ? p.nameEn : p.name;
        return name.toLowerCase().includes(lowerQuery);
      })
      .slice(0, 4);
  }, [lowerQuery, locale]);

  const blogResults = useMemo(() => {
    if (!lowerQuery) return [];
    return blogPosts
      .filter((post) => post.title[locale].toLowerCase().includes(lowerQuery))
      .slice(0, 4);
  }, [lowerQuery, locale]);

  const hasResults = productResults.length > 0 || blogResults.length > 0;
  const hasQuery = lowerQuery.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeSearch}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 mx-auto mt-20 w-full max-w-[640px] px-4 sm:px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            {/* Search input */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full h-14 pl-14 pr-14 bg-surface border border-default rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-crocus/40 text-base text-primary placeholder:text-muted transition-colors"
              />
              <button
                onClick={closeSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-primary transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            {hasQuery && (
              <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-2xl bg-surface border border-default shadow-2xl">
                {!hasResults ? (
                  <div className="px-6 py-12 text-center text-muted">
                    {t.search.noResults}
                  </div>
                ) : (
                  <div className="py-2">
                    {/* Product results */}
                    {productResults.length > 0 && (
                      <div>
                        <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                          {t.search.products}
                        </div>
                        {productResults.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            onClick={closeSearch}
                            className="flex items-center gap-4 px-5 py-3 hover:bg-surface-alt transition-colors"
                          >
                            <img
                              src={product.images[0]}
                              alt={locale === 'en' ? product.nameEn : product.name}
                              className="h-12 w-12 rounded-lg object-cover bg-surface-alt"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-primary truncate">
                                {locale === 'en' ? product.nameEn : product.name}
                              </div>
                              <div className="text-xs text-crocus font-medium mt-0.5">
                                {formatPrice(product.price)}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Blog results */}
                    {blogResults.length > 0 && (
                      <div>
                        {productResults.length > 0 && (
                          <div className="mx-5 border-t border-default" />
                        )}
                        <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                          {t.search.blogPosts}
                        </div>
                        {blogResults.map((post) => (
                          <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            onClick={closeSearch}
                            className="flex items-center gap-4 px-5 py-3 hover:bg-surface-alt transition-colors"
                          >
                            <img
                              src={post.coverImage}
                              alt={post.title[locale]}
                              className="h-12 w-12 rounded-lg object-cover bg-surface-alt"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-primary truncate">
                                {post.title[locale]}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hint */}
            <div className="mt-3 text-center text-xs text-white/50">
              {t.search.hint}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
