import { motion } from 'framer-motion';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomeProcessSection() {
  const { t } = useI18n();

  const steps = [
    { step: '01', title: t.steps.s1, desc: t.steps.s1d },
    { step: '02', title: t.steps.s2, desc: t.steps.s2d },
    { step: '03', title: t.steps.s3, desc: t.steps.s3d },
    { step: '04', title: t.steps.s4, desc: t.steps.s4d },
  ];

  return (
    <section className="py-16 lg:py-28 bg-brand text-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-3">Process</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-[-0.03em]">{t.sections.howItWorks}</h2>
          <p className="text-white/55 mt-4 max-w-xl mx-auto text-sm sm:text-base">{t.sections.howItWorksDesc}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
              className="p-10 bg-brand"
            >
              <span className="text-6xl font-bold text-white/[0.06]">{s.step}</span>
              <h3 className="text-base font-semibold mt-4 mb-3">{s.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
