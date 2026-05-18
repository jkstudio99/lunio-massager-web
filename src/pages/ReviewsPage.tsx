import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, BadgeCheck, Quote, Filter } from 'lucide-react';
import { reviews } from '@/data/products';
import { useI18n } from '@/store/i18n';
import { cn } from '@/lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
};

function RatingSummary() {
  const { locale } = useI18n();
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-3xl bg-surface-alt">
      {/* Big score */}
      <div className="text-center sm:pr-8 sm:border-r sm:border-default">
        <p className="text-6xl font-bold text-primary">{avg.toFixed(1)}</p>
        <div className="flex items-center gap-0.5 mt-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < Math.round(avg) ? 'fill-crocus text-crocus' : 'text-light-gray'}
            />
          ))}
        </div>
        <p className="text-sm text-muted mt-2">
          {reviews.length} {locale === 'zh-TW' ? '則評價' : 'reviews'}
        </p>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-2 w-full max-w-xs">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary w-4 text-right">{star}</span>
            <Star size={12} className="fill-crocus text-crocus shrink-0" />
            <div className="flex-1 h-2 rounded-full bg-light-gray overflow-hidden">
              <div
                className="h-full rounded-full bg-crocus transition-all duration-700"
                style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm text-muted w-6 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const { locale } = useI18n();
  const [filter, setFilter] = useState<number | null>(null);

  const filtered = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="bg-surface-alt border-b border-default">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-3">
              Testimonials
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-[-0.02em]">
              {locale === 'zh-TW' ? '顧客評價' : 'Customer Reviews'}
            </h1>
            <p className="text-muted mt-2 max-w-lg">
              {locale === 'zh-TW'
                ? '看看我們的顧客怎麼說，真實使用心得分享'
                : 'See what our customers say — real experiences from real users'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10 lg:py-16">
        {/* Rating summary */}
        <motion.div {...fadeInUp} className="mb-10">
          <RatingSummary />
        </motion.div>

        {/* Filter chips */}
        <motion.div {...fadeInUp} className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter size={16} className="text-muted" />
          <button
            onClick={() => setFilter(null)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
              !filter ? 'bg-crocus text-white' : 'bg-surface-alt text-secondary hover:bg-light-gray'
            )}
          >
            {locale === 'zh-TW' ? '全部' : 'All'}
          </button>
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              onClick={() => setFilter(n)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1',
                filter === n ? 'bg-crocus text-white' : 'bg-surface-alt text-secondary hover:bg-light-gray'
              )}
            >
              {n} <Star size={10} className={filter === n ? 'fill-white text-white' : 'fill-crocus text-crocus'} />
            </button>
          ))}
        </motion.div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative bg-surface rounded-2xl border border-default hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                {review.image && (
                  <div className="sm:w-48 aspect-[4/3] sm:aspect-auto sm:min-h-full overflow-hidden shrink-0">
                    <img
                      src={review.image}
                      alt={review.author}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                  <Quote size={24} className="text-crocus/15 mb-3" />

                  {/* Product */}
                  {review.product && (
                    <p className="text-xs font-semibold text-crocus mb-2">
                      {review.product[locale]}
                    </p>
                  )}

                  {/* Comment */}
                  <p className="text-sm text-secondary leading-relaxed mb-4">
                    {review.comment[locale]}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={13}
                        className={j < review.rating ? 'fill-crocus text-crocus' : 'text-light-gray'}
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-default/60">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.author} className="w-9 h-9 rounded-full bg-surface-alt" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-crocus/10 flex items-center justify-center text-xs font-bold text-crocus">
                        {review.author[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-primary">{review.author}</p>
                        {review.verified && <BadgeCheck size={13} className="text-crocus" />}
                      </div>
                      {review.role && <p className="text-[11px] text-muted">{review.role}</p>}
                    </div>
                    <p className="text-[11px] text-muted">{review.date}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Star size={48} className="mx-auto mb-4 text-muted" />
            <p className="text-lg font-semibold text-primary">
              {locale === 'zh-TW' ? '暫無此評分的評價' : 'No reviews with this rating'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
