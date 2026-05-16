import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, BadgeCheck } from 'lucide-react';
import { reviews } from '@/data/products';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

/* ── Rating summary ── */
function RatingSummary() {
  const { locale, t } = useI18n();
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 justify-center mb-14">
      {/* Score */}
      <div className="text-center">
        <p className="text-5xl font-bold text-primary">{avg.toFixed(1)}</p>
        <div className="flex items-center gap-0.5 mt-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.round(avg) ? 'fill-crocus text-crocus' : 'text-light-gray'}
            />
          ))}
        </div>
        <p className="text-xs text-muted mt-1">
          {reviews.length} {locale === 'zh-TW' ? '則評價' : 'reviews'}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="space-y-1.5 w-48">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-xs text-muted w-3 text-right">{star}</span>
            <Star size={10} className="fill-crocus text-crocus shrink-0" />
            <div className="flex-1 h-1.5 rounded-full bg-surface-alt overflow-hidden">
              <div
                className="h-full rounded-full bg-crocus transition-all duration-500"
                style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-muted w-4">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Single review card ── */
function ReviewCard({ review, index }: { review: (typeof reviews)[0]; index: number }) {
  const { locale } = useI18n();
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative p-7 bg-surface rounded-2xl border border-default hover:shadow-lg transition-all duration-300 group"
    >
      {/* Quote icon */}
      <Quote size={28} className="absolute top-5 right-5 text-crocus/10 group-hover:text-crocus/20 transition-colors" />

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star
            key={j}
            size={14}
            className={j < review.rating ? 'fill-crocus text-crocus' : 'text-light-gray'}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-[15px] text-secondary leading-[1.8] mb-5 line-clamp-4">
        {review.comment[locale]}
      </p>

      {/* Product badge */}
      {review.product && (
        <p className="text-[11px] text-crocus font-medium bg-crocus/8 inline-block px-2.5 py-1 rounded-full mb-5">
          {review.product[locale]}
        </p>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3 pt-5 border-t border-default">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.author}
            className="w-10 h-10 rounded-full bg-surface-alt object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-crocus/10 flex items-center justify-center text-sm font-bold text-crocus">
            {review.author[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-primary truncate">{review.author}</p>
            {review.verified && (
              <BadgeCheck size={14} className="text-crocus shrink-0" />
            )}
          </div>
          {review.role && (
            <p className="text-[11px] text-muted">{review.role}</p>
          )}
        </div>
        <p className="text-[11px] text-muted shrink-0">{review.date}</p>
      </div>
    </motion.div>
  );
}

/* ── Main section ── */
export default function HomeReviewsSection() {
  const { t, locale } = useI18n();
  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const [page, setPage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const next = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);
  const prev = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [autoPlay, next]);

  const currentReviews = reviews.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-16 lg:py-28 bg-surface-alt transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-10">
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">
            {t.sections.reviews}
          </h2>
          <p className="text-secondary mt-4 max-w-xl mx-auto text-sm sm:text-base">
            {t.sections.reviewsDesc}
          </p>
        </motion.div>

        {/* Rating summary */}
        <motion.div {...fadeInUp}>
          <RatingSummary />
        </motion.div>

        {/* Cards */}
        <div
          className="relative"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() => { prev(); setAutoPlay(false); }}
                className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-default shadow-sm flex items-center justify-center text-secondary hover:text-primary hover:shadow-md transition-all z-10"
                aria-label="Previous reviews"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => { next(); setAutoPlay(false); }}
                className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-default shadow-sm flex items-center justify-center text-secondary hover:text-primary hover:shadow-md transition-all z-10"
                aria-label="Next reviews"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i); setAutoPlay(false); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? 'w-6 bg-crocus' : 'w-2 bg-crocus/25 hover:bg-crocus/40'
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
