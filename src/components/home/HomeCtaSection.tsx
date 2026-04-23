import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomeCtaSection() {
  const { t } = useI18n();

  return (
    <section className="relative py-20 lg:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&h=800&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand/85" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-[-0.03em] leading-[1.05]">
            {t.cta.title}
            <br />
            <span className="text-crocus">{t.cta.titleAccent}</span>
            {t.cta.titleEnd}
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-12 text-[15px]">
            {t.cta.subtitle}
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-brand text-sm font-medium tracking-wide uppercase rounded-full hover:bg-crocus hover:text-white transition-all duration-300"
          >
            {t.cta.button}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
