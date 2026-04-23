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

export default function HomeStorySection() {
  const { t } = useI18n();

  return (
    <section className="py-0 transition-colors">
      <div className="grid lg:grid-cols-2 min-h-[72vh]">
        <motion.div {...fadeInUp} className="relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1000&h=1200&fit=crop"
            alt="Lunio Brand"
            className="w-full h-full object-cover min-h-[400px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        </motion.div>
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.15 }}
          className="flex flex-col justify-center px-8 lg:px-20 py-20 lg:py-32 bg-surface-alt"
        >
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-6">Our Story</p>
          <h2 className="text-3xl lg:text-5xl font-bold text-primary tracking-[-0.03em] mb-8 leading-[1.1]">
            {t.sections.brandStoryTitle}
          </h2>
          <p className="text-secondary leading-[1.8] mb-10 max-w-md text-[15px]">
            {t.sections.brandStoryDesc}
          </p>
          <Link
            to="/about"
            className="group inline-flex items-center gap-3 text-sm font-medium text-primary hover:text-crocus transition-colors w-fit"
          >
            <span className="uppercase tracking-wider">{t.sections.exploreBrand}</span>
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
