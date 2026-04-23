import { Sparkles, Gauge, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomeBenefitsSection() {
  const { t } = useI18n();

  const items = [
    { icon: Sparkles, title: t.benefits.b1Title, sub: t.benefits.b1Sub, desc: t.benefits.b1Desc },
    { icon: Gauge, title: t.benefits.b2Title, sub: t.benefits.b2Sub, desc: t.benefits.b2Desc },
    { icon: Target, title: t.benefits.b3Title, sub: t.benefits.b3Sub, desc: t.benefits.b3Desc },
  ];

  return (
    <section className="py-16 lg:py-28 bg-surface transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-[-0.02em] leading-tight">
            {t.benefits.heading}
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-secondary mt-2">{t.benefits.subheading}</p>
          <p className="text-sm sm:text-base text-muted mt-4 max-w-lg mx-auto leading-relaxed">
            {t.benefits.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
          {items.map(({ icon: Icon, title, sub, desc }, index) => (
            <motion.div
              key={title}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: index * 0.12 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-crocus/10 text-crocus">
                <Icon size={32} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">{title}</h3>
              <p className="text-xs font-medium tracking-widest uppercase text-crocus mb-3">({sub})</p>
              <p className="text-sm text-secondary leading-relaxed max-w-[260px]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
