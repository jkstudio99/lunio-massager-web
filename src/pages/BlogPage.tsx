import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, MapPin, Phone, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/store/i18n';
import { blogPosts, blogCategories } from '@/data/blog';

export default function BlogPage() {
  const { t, locale } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const featured = blogPosts.find((p) => p.featured) || blogPosts[0];

  const filtered = blogPosts.filter((post) => {
    if (activeCategory && post.category[locale] !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title[locale].toLowerCase().includes(q) ||
        post.excerpt[locale].toLowerCase().includes(q)
      );
    }
    return true;
  });

  const rest = filtered.filter((p) => p.id !== featured.id);
  const recentPosts = blogPosts.slice(0, 5);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Banner */}
      <section className="relative h-[280px] lg:h-[340px] overflow-hidden">
        <img
          src={featured.coverImage}
          alt={featured.title[locale]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/85 via-brand/50 to-brand/25" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/50 mb-3">
                {t.blog.title}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-2xl mb-2">
                {t.blog.subtitle}
              </h1>
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    !activeCategory
                      ? 'bg-crocus text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  )}
                >
                  {t.blog.allCategories}
                </button>
                {blogCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name[locale])}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      activeCategory === cat.name[locale]
                        ? 'bg-crocus text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    )}
                  >
                    {cat.name[locale]}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-8">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.blog.searchBlog}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-default bg-surface-alt text-sm text-primary placeholder:text-muted focus:outline-none focus:border-crocus/50 transition-colors"
              />
            </div>

            {/* Featured Post (only when no filter) */}
            {!activeCategory && !searchQuery && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <Link
                  to={`/blog/${featured.slug}`}
                  className="group grid md:grid-cols-2 gap-6 p-4 -m-4 rounded-3xl hover:bg-surface-alt/50 transition-colors"
                >
                  <div className="rounded-2xl overflow-hidden aspect-[3/2]">
                    <img
                      src={featured.coverImage}
                      alt={featured.title[locale]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-crocus uppercase tracking-wider mb-3">
                      ⭐ {t.blog.featuredPost}
                    </span>
                    <h2 className="text-xl lg:text-2xl font-bold text-primary mb-3 leading-tight group-hover:text-crocus transition-colors">
                      {featured.title[locale]}
                    </h2>
                    <p className="text-sm text-secondary leading-relaxed mb-4 line-clamp-3">
                      {featured.excerpt[locale]}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs text-muted">{formatDate(featured.publishedAt)}</span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Clock size={12} /> {featured.readTime} {t.blog.minutes}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-crocus">
                      {t.blog.readMore} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Posts Grid */}
            {rest.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {rest.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="group"
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <div className="rounded-xl overflow-hidden aspect-[3/2] mb-3">
                        <img
                          src={post.coverImage}
                          alt={post.title[locale]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-crocus uppercase tracking-wider">
                        {post.category[locale]}
                      </span>
                      <h3 className="text-base font-bold text-primary mt-1.5 mb-1.5 group-hover:text-crocus transition-colors line-clamp-2 leading-snug">
                        {post.title[locale]}
                      </h3>
                      <p className="text-xs text-secondary/70 line-clamp-2 mb-2">
                        {post.excerpt[locale]}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-muted">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {post.readTime} {t.blog.minutes}
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted">{t.blog.noResults}</p>
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setSearchQuery('');
                  }}
                  className="mt-3 text-sm font-medium text-crocus hover:text-crocus-hover transition-colors"
                >
                  {t.blog.viewAll}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[300px] flex-shrink-0 space-y-6">
            {/* Promotion Banner */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-crocus/90 to-brand text-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                {t.blog.promotionBanner}
              </p>
              <p className="text-sm font-bold mb-3 leading-snug">
                {t.blog.promotionDesc}
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline"
              >
                {t.blog.promotionCta} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Recent Articles */}
            <div className="rounded-2xl border border-default p-5">
              <h3 className="text-sm font-bold text-primary mb-4">
                {t.blog.recentArticles}
              </h3>
              <div className="space-y-4">
                {recentPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.slug}`}
                    className="group flex gap-3"
                  >
                    <img
                      src={rp.coverImage}
                      alt={rp.title[locale]}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary group-hover:text-crocus transition-colors line-clamp-2 leading-snug">
                        {rp.title[locale]}
                      </p>
                      <p className="text-[10px] text-muted mt-1">
                        {rp.readTime} {t.blog.minutes}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Activities of the Month */}
            <div className="rounded-2xl border border-default p-5">
              <h3 className="text-sm font-bold text-primary mb-4">
                {t.blog.activitiesOfMonth}
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-surface-alt">
                  <p className="text-xs font-semibold text-crocus mb-1">
                    🎉 {locale === 'zh-TW' ? '五月感恩回饋' : 'May Gratitude Sale'}
                  </p>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {locale === 'zh-TW'
                      ? '全館按摩器限時 85 折，滿 NT$3,000 再送收納袋'
                      : 'All massagers 15% off, free carry bag on orders over NT$3,000'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-surface-alt">
                  <p className="text-xs font-semibold text-crocus mb-1">
                    🎁 {locale === 'zh-TW' ? '新會員禮' : 'New Member Gift'}
                  </p>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {locale === 'zh-TW'
                      ? '首次註冊即享 NT$200 購物金，首購免運'
                      : 'Get NT$200 credit on signup, free shipping on first order'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-surface-alt">
                  <p className="text-xs font-semibold text-crocus mb-1">
                    💡 {locale === 'zh-TW' ? '按摩體驗日' : 'Massage Demo Day'}
                  </p>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {locale === 'zh-TW'
                      ? '每週六下午 2:00-5:00，到門市免費體驗全系列'
                      : 'Every Saturday 2:00-5:00 PM, free trial at store'}
                  </p>
                </div>
              </div>
            </div>

            {/* Store Front */}
            <div className="rounded-2xl border border-default p-5">
              <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <MapPin size={14} className="text-crocus" /> {t.blog.storeFront}
              </h3>
              <div className="rounded-xl overflow-hidden mb-3 aspect-[16/9] bg-surface-alt">
                <img
                  src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&h=225&fit=crop"
                  alt="Lunio Store"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 text-xs text-secondary">
                <p className="flex items-start gap-2">
                  <MapPin size={12} className="text-muted mt-0.5 flex-shrink-0" />
                  {t.blog.storeAddress}
                </p>
                <p className="flex items-start gap-2">
                  <Clock size={12} className="text-muted mt-0.5 flex-shrink-0" />
                  {t.blog.storeHours}
                </p>
                <p className="flex items-start gap-2">
                  <Phone size={12} className="text-muted mt-0.5 flex-shrink-0" />
                  {t.blog.storePhone}
                </p>
              </div>
            </div>

            {/* Lunio Badge */}
            <div className="rounded-2xl bg-brand p-5 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl font-bold text-white">L</span>
              </div>
              <p className="text-sm font-bold text-white mb-1">Lunio</p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                {locale === 'zh-TW'
                  ? '專為現代生活設計的按摩科技品牌，結合人體工學與智慧技術，讓放鬆成為日常。'
                  : 'Massage technology brand for modern living. Ergonomics meets smart tech for everyday relaxation.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
