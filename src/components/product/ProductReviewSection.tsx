import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, BadgeCheck, MessageSquarePlus } from 'lucide-react';
import { reviews as allReviews } from '@/data/products';
import { useI18n } from '@/store/i18n';
import { useToastStore } from '@/store/toast';
import type { Review } from '@/types/product';

/* ── Star selector ── */
function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={n <= (hover || value) ? 'fill-crocus text-crocus' : 'text-light-gray'}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Rating summary bar ── */
function RatingSummary({ filtered }: { filtered: Review[] }) {
  const avg = filtered.length ? filtered.reduce((s, r) => s + r.rating, 0) / filtered.length : 0;
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: filtered.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{avg.toFixed(1)}</p>
        <div className="flex items-center gap-0.5 mt-1 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < Math.round(avg) ? 'fill-crocus text-crocus' : 'text-light-gray'} />
          ))}
        </div>
        <p className="text-xs text-muted mt-1">{filtered.length} reviews</p>
      </div>
      <div className="space-y-1 w-44">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-xs text-muted w-3 text-right">{star}</span>
            <Star size={10} className="fill-crocus text-crocus shrink-0" />
            <div className="flex-1 h-1.5 rounded-full bg-surface-alt overflow-hidden">
              <div
                className="h-full rounded-full bg-crocus"
                style={{ width: `${filtered.length ? (count / filtered.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-muted w-4">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main section ── */
export default function ProductReviewSection({ productId }: { productId: string }) {
  const { t, locale } = useI18n();
  const addToast = useToastStore((s) => s.addToast);

  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const filtered = useMemo(
    () => [
      ...localReviews,
      ...allReviews.filter((r) => r.productId === productId),
    ],
    [productId, localReviews]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      addToast(t.product.ratingRequired, 'error');
      return;
    }
    const newReview: Review = {
      id: crypto.randomUUID(),
      productId,
      author: name.trim(),
      rating,
      comment: { 'zh-TW': comment.trim(), en: comment.trim() },
      date: new Date().toISOString().slice(0, 10),
      verified: false,
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    setName('');
    setRating(0);
    setComment('');
    setShowForm(false);
    addToast(t.product.reviewAdded, 'success');
  };

  return (
    <section className="py-12 lg:py-16 border-t border-default">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-primary">{t.product.reviewsTitle}</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 h-10 px-5 rounded-full border border-crocus text-crocus text-sm font-semibold hover:bg-crocus hover:text-white transition-all"
          >
            <MessageSquarePlus size={16} />
            {t.product.writeReview}
          </button>
        </div>

        {/* Write review form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-surface-alt rounded-2xl border border-default space-y-4">
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">{t.product.yourName}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 border border-default rounded-lg bg-surface text-primary text-sm focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">Rating</label>
                  <StarSelector value={rating} onChange={setRating} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">{t.product.yourReview}</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-default rounded-lg bg-surface text-primary text-sm focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {t.product.submitReview}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {filtered.length > 0 ? (
          <>
            <RatingSummary filtered={filtered} />
            <div className="grid gap-4">
              {filtered.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="p-6 bg-surface rounded-2xl border border-default"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {review.avatar ? (
                      <img src={review.avatar} alt="" className="w-10 h-10 rounded-full bg-surface-alt" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-crocus/10 flex items-center justify-center text-sm font-bold text-crocus">
                        {review.author[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-primary">{review.author}</span>
                        {review.verified && <BadgeCheck size={14} className="text-crocus" />}
                        {review.role && <span className="text-[11px] text-muted">· {review.role}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} size={12} className={j < review.rating ? 'fill-crocus text-crocus' : 'text-light-gray'} />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">{review.comment[locale]}</p>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted text-sm">{t.product.noReviews}</p>
          </div>
        )}
      </div>
    </section>
  );
}
