import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from 'lucide-react';
import { reviews } from '@/data/products';
import { useI18n } from '@/store/i18n';
import { cn } from '@/lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomeReviewsSection() {
  const { t, locale } = useI18n();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState(1);

  const total = reviews.length;

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [autoPlay, next]);

  const review = reviews[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="py-16 lg:py-28 bg-surface transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-12 lg:mb-16">
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

        {/* Review card — image left, text right */}
        <motion.div {...fadeInUp}>
          <div
            className="relative mx-auto max-w-[1000px]"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <div className="overflow-hidden rounded-3xl bg-surface-alt">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-2"
                >
                  {/* Left — Image */}
                  <motion.div
                    custom={direction}
                    variants={imageVariants}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] overflow-hidden"
                  >
                    {review.image ? (
                      <img
                        src={review.image}
                        alt={review.author}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-crocus/20 to-crocus/5 flex items-center justify-center">
                        <img src="/img/lunio logo.png" alt="Lunio" className="w-24 opacity-30" />
                      </div>
                    )}
                  </motion.div>

                  {/* Right — Quote content */}
                  <motion.div
                    custom={direction}
                    variants={slideVariants}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14"
                  >
                    {/* Open quote */}
                    <svg
                      width="48" height="36" viewBox="0 0 48 36" fill="none"
                      className="text-crocus/30 mb-6 shrink-0"
                    >
                      <path d="M0 36V20.25C0 14.55 1.35 9.9 4.05 6.3C6.75 2.7 10.8 0.45 16.2 -0.6L18 5.4C14.4 6.3 11.7 7.95 9.9 10.35C8.1 12.75 7.2 15.6 7.2 18.9H16.8V36H0ZM26.4 36V20.25C26.4 14.55 27.75 9.9 30.45 6.3C33.15 2.7 37.2 0.45 42.6 -0.6L44.4 5.4C40.8 6.3 38.1 7.95 36.3 10.35C34.5 12.75 33.6 15.6 33.6 18.9H43.2V36H26.4Z" fill="currentColor" />
                    </svg>

                    {/* Title — Product name */}
                    {review.product && (
                      <h3 className="text-xl lg:text-2xl font-bold text-primary tracking-[-0.02em] mb-4 leading-tight">
                        {review.product[locale]}
                      </h3>
                    )}

                    {/* Comment */}
                    <p className="text-base lg:text-[17px] text-secondary leading-[1.9] mb-6">
                      {review.comment[locale]}
                    </p>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-crocus text-crocus' : 'text-light-gray'}
                        />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-5 border-t border-default/60">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="w-11 h-11 rounded-full bg-surface object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-crocus/10 flex items-center justify-center text-sm font-bold text-crocus">
                          {review.author[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-primary">{review.author}</p>
                          {review.verified && (
                            <BadgeCheck size={14} className="text-crocus shrink-0" />
                          )}
                        </div>
                        {review.role && (
                          <p className="text-xs text-muted">{review.role}</p>
                        )}
                      </div>
                    </div>

                    {/* Close quote */}
                    <div className="flex justify-end mt-4">
                      <svg
                        width="40" height="30" viewBox="0 0 48 36" fill="none"
                        className="text-crocus/20 rotate-180"
                      >
                        <path d="M0 36V20.25C0 14.55 1.35 9.9 4.05 6.3C6.75 2.7 10.8 0.45 16.2 -0.6L18 5.4C14.4 6.3 11.7 7.95 9.9 10.35C8.1 12.75 7.2 15.6 7.2 18.9H16.8V36H0ZM26.4 36V20.25C26.4 14.55 27.75 9.9 30.45 6.3C33.15 2.7 37.2 0.45 42.6 -0.6L44.4 5.4C40.8 6.3 38.1 7.95 36.3 10.35C34.5 12.75 33.6 15.6 33.6 18.9H43.2V36H26.4Z" fill="currentColor" />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation — Arrows + Dots */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {/* Prev arrow */}
              <button
                onClick={() => { prev(); setAutoPlay(false); }}
                className="w-10 h-10 rounded-full border border-default bg-surface flex items-center justify-center text-secondary hover:text-primary hover:border-crocus hover:shadow-sm transition-all"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { go(i); setAutoPlay(false); }}
                    className={cn(
                      'rounded-full transition-all duration-300',
                      i === current
                        ? 'w-3 h-3 bg-crocus'
                        : 'w-2.5 h-2.5 bg-crocus/20 hover:bg-crocus/40'
                    )}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next arrow */}
              <button
                onClick={() => { next(); setAutoPlay(false); }}
                className="w-10 h-10 rounded-full border border-default bg-surface flex items-center justify-center text-secondary hover:text-primary hover:border-crocus hover:shadow-sm transition-all"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
