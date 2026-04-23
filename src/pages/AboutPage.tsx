import { motion } from 'framer-motion';
import { Award, Heart, Lightbulb, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/store/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function AboutPage() {
  const { t } = useI18n();

  const values = [
    { icon: Lightbulb, title: t.about.values.innovation, desc: t.about.values.innovationDesc },
    { icon: Heart, title: t.about.values.stylish, desc: t.about.values.stylishDesc },
    { icon: Award, title: t.about.values.charming, desc: t.about.values.charmingDesc },
    { icon: Users, title: t.about.values.vibrant, desc: t.about.values.vibrantDesc },
  ];

  return (
    <div className="bg-surface">
      {/* Hero — Full-bleed cinematic */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-black -mt-[68px] pt-[68px]">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1556760544-74068565f05c?w=1920&h=1000&fit=crop"
            alt="Lunio team"
            className="w-full h-full object-cover opacity-50"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <div className="relative z-10 flex flex-col justify-end h-full pb-16 lg:pb-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-6">About Us</p>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-[0.95] mb-6 max-w-3xl">
                {t.about.subtitle}
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                {t.about.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story — cinematic split */}
      <section className="py-0">
        <div className="grid lg:grid-cols-2 min-h-[70vh]">
          <motion.div {...fadeInUp} className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1000&h=1200&fit=crop"
              alt="Lunio Story"
              className="w-full h-full object-cover min-h-[400px]"
            />
          </motion.div>
          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.15 }}
            className="flex flex-col justify-center px-8 lg:px-20 py-20 lg:py-32 bg-surface-alt"
          >
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-6">{t.sections.brandStory}</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-8 tracking-[-0.03em] leading-[1.1]">
              {t.sections.brandStoryTitle}
            </h2>
            <div className="space-y-5 text-[15px] text-secondary leading-[1.8]">
              <p>{t.sections.brandStoryDesc}</p>
              <p>{t.about.description}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values — fashion grid */}
      <section className="py-24 lg:py-32 bg-brand text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-3">Values</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-[-0.03em]">
              {t.about.values.heading}
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="p-10 bg-brand text-center"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-white/10 flex items-center justify-center">
                  <v.icon size={24} className="text-crocus" />
                </div>
                <h3 className="text-base font-semibold mb-3">{v.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — editorial */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
            {[
              { num: '50K+', label: t.about.stats.clients },
              { num: '6+', label: t.about.stats.products },
              { num: '4.8', label: t.about.stats.rating },
              { num: '15+', label: t.about.stats.certifications },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="text-center py-12"
              >
                <p className="text-5xl lg:text-6xl font-bold text-crocus mb-3 tracking-[-0.03em]">{s.num}</p>
                <p className="text-xs text-muted uppercase tracking-[0.2em]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 lg:py-44 overflow-hidden">
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
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 tracking-[-0.03em]">
              {t.cta.title} <span className="text-crocus">{t.cta.titleAccent}</span>{t.cta.titleEnd}
            </h2>
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
    </div>
  );
}
