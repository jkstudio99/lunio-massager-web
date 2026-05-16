import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, ArrowRight, Calendar, User, Tag, MapPin, Phone } from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { getBlogBySlug, getRelatedPosts, blogPosts } from '@/data/blog';
import CommentSection from '@/components/blog/CommentSection';
import ShareMenu from '@/components/common/ShareMenu';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();

  const post = getBlogBySlug(slug || '');

  if (!post) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">404</h1>
          <p className="text-muted mb-6">{t.blog.noResults}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-crocus hover:text-crocus-hover transition-colors"
          >
            <ArrowLeft size={16} /> {t.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post.id, 3);
  const recentPosts = blogPosts.slice(0, 5);

  // Find prev/next posts
  const currentIndex = blogPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === 'zh-TW' ? 'zh-TW' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Banner */}
      <section className="relative h-[320px] lg:h-[400px] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title[locale]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/40 to-brand/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft size={14} /> {t.blog.backToBlog}
              </Link>
              <span className="block text-xs font-semibold text-crocus uppercase tracking-wider mb-3">
                {post.category[locale]}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl">
                {post.title[locale]}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {post.readTime} {t.blog.minutes}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} /> {post.author.name}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            {/* Author bar */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-default">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-lg font-bold text-brand overflow-hidden">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                  post.author.name.charAt(0)
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{post.author.name}</p>
                <p className="text-xs text-muted">{post.author.role[locale]}</p>
              </div>
              <div className="ml-auto">
                <ShareMenu
                  url={window.location.href}
                  title={post.title[locale]}
                  variant="inline"
                />
              </div>
            </div>

            {/* Article content */}
            <article
              className="prose prose-lg max-w-none
                prose-headings:text-primary prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-secondary prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-crocus prose-a:no-underline hover:prose-a:underline
                prose-strong:text-primary
                prose-ul:my-4 prose-li:text-secondary prose-li:mb-1
                prose-blockquote:border-l-crocus prose-blockquote:bg-surface-alt prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-secondary
                prose-img:rounded-2xl prose-img:shadow-sm
                prose-table:text-sm
                prose-th:bg-surface-alt prose-th:text-primary prose-th:font-semibold prose-th:py-3 prose-th:px-4
                prose-td:py-2.5 prose-td:px-4 prose-td:border-default
              "
              dangerouslySetInnerHTML={{ __html: post.content[locale] }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-default">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={14} className="text-muted" />
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium text-crocus bg-crocus/8 rounded-full"
                    >
                      {tag[locale]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related product CTA */}
            {post.relatedProductSlug && (
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-brand to-brand/90 text-white">
                <p className="text-sm font-medium text-white/70 mb-1">{t.blog.promotionBanner}</p>
                <p className="text-lg font-bold mb-3">{t.blog.promotionDesc}</p>
                <Link
                  to={`/product/${post.relatedProductSlug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-crocus text-white text-sm font-semibold hover:bg-crocus-hover transition-colors"
                >
                  {t.blog.promotionCta} <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Comment Section */}
            <CommentSection postId={post.id} />

            {/* Prev / Next navigation */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="group flex flex-col p-5 rounded-2xl border border-default hover:border-crocus/30 transition-colors"
                >
                  <span className="text-xs text-muted mb-2">{t.blog.prevArticle}</span>
                  <span className="text-sm font-semibold text-primary group-hover:text-crocus transition-colors line-clamp-2">
                    {prevPost.title[locale]}
                  </span>
                </Link>
              ) : <div />}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group flex flex-col items-end text-right p-5 rounded-2xl border border-default hover:border-crocus/30 transition-colors"
                >
                  <span className="text-xs text-muted mb-2">{t.blog.nextArticle}</span>
                  <span className="text-sm font-semibold text-primary group-hover:text-crocus transition-colors line-clamp-2">
                    {nextPost.title[locale]}
                  </span>
                </Link>
              )}
            </div>
          </motion.main>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-[320px] flex-shrink-0 space-y-6"
          >
            {/* Promotion Banner */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-crocus/90 to-brand text-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                {t.blog.promotionBanner}
              </p>
              <p className="text-base font-bold mb-3 leading-snug">
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
              <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                {t.blog.recentArticles}
              </h3>
              <div className="space-y-4">
                {recentPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.slug}`}
                    className={`group flex gap-3 ${rp.id === post.id ? 'opacity-50 pointer-events-none' : ''}`}
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
                  <p className="text-xs font-semibold text-crocus mb-1">🎉 {locale === 'zh-TW' ? '五月感恩回饋' : 'May Gratitude Sale'}</p>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {locale === 'zh-TW'
                      ? '全館按摩器限時 85 折，滿 NT$3,000 再送收納袋'
                      : 'All massagers 15% off, free carry bag on orders over NT$3,000'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-surface-alt">
                  <p className="text-xs font-semibold text-crocus mb-1">🎁 {locale === 'zh-TW' ? '新會員禮' : 'New Member Gift'}</p>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {locale === 'zh-TW'
                      ? '首次註冊即享 NT$200 購物金，首購免運'
                      : 'Get NT$200 credit on first signup, free shipping on first order'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-surface-alt">
                  <p className="text-xs font-semibold text-crocus mb-1">💡 {locale === 'zh-TW' ? '按摩體驗日' : 'Massage Demo Day'}</p>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {locale === 'zh-TW'
                      ? '每週六下午 2:00-5:00，到門市免費體驗全系列產品'
                      : 'Every Saturday 2:00-5:00 PM, free trial at our store'}
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
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">L</span>
              </div>
              <p className="text-sm font-bold text-white mb-1">Lunio</p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                {locale === 'zh-TW'
                  ? '專為現代生活設計的按摩科技品牌，結合人體工學與智慧技術，讓放鬆成為日常。'
                  : 'A massage technology brand designed for modern living, combining ergonomics with smart tech for everyday relaxation.'}
              </p>
            </div>
          </motion.aside>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-default">
            <h2 className="text-xl font-bold text-primary mb-6">{t.blog.relatedArticles}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp, i) => (
                <motion.article
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${rp.slug}`}>
                    <div className="rounded-xl overflow-hidden aspect-[3/2] mb-3">
                      <img
                        src={rp.coverImage}
                        alt={rp.title[locale]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-crocus uppercase tracking-wider">
                      {rp.category[locale]}
                    </span>
                    <h3 className="text-sm font-semibold text-primary mt-1 group-hover:text-crocus transition-colors line-clamp-2">
                      {rp.title[locale]}
                    </h3>
                    <p className="text-xs text-muted mt-1.5">
                      {rp.readTime} {t.blog.minutes}
                    </p>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
