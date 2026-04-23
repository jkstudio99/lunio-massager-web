import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { reviews } from '@/data/products';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomeReviewsSection() {
  const { t } = useI18n();

  return (
    <section className="py-16 lg:py-28 bg-surface-alt transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-3">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">{t.sections.reviews}</h2>
          <p className="text-secondary mt-4 max-w-xl mx-auto text-sm sm:text-base">{t.sections.reviewsDesc}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, i) => (
            <motion.div
              key={review.id}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
              className="p-8 bg-surface rounded-2xl border border-default transition-colors"
            >
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className={j < review.rating ? 'fill-crocus text-crocus' : 'text-light-gray'}
                  />
                ))}
              </div>
              <p className="text-[15px] text-secondary leading-[1.8] mb-6">{review.comment}</p>
              <div className="flex items-center justify-between pt-5 border-t border-default">
                <div>
                  <p className="text-sm font-semibold text-primary">{review.author}</p>
                  {review.verified && (
                    <p className="text-[10px] text-success font-medium mt-0.5">{t.sections.verifiedPurchase}</p>
                  )}
                </div>
                <p className="text-xs text-muted">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
