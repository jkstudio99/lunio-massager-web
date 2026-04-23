import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/store/i18n';
import heroCover1 from '@/assets/img/Cover.jpg';
import heroCover2 from '@/assets/img/Cover2.jpg';

const heroCover3 = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&h=1080&fit=crop';

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, scale: 1.08, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, scale: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, scale: 1.04, x: dir > 0 ? -60 : 60 }),
};

const textVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function HomeHeroSection() {
  const { t } = useI18n();
  const heroSlides = [
    {
      image: heroCover1,
      title: t.hero.title1,
      accent: t.hero.titleAccent,
      subtitle: t.hero.subtitle,
    },
    {
      image: heroCover2,
      title: t.hero.title1_2,
      accent: t.hero.titleAccent2,
      subtitle: t.hero.subtitle2,
    },
    {
      image: heroCover3,
      title: t.hero.title1_3,
      accent: t.hero.titleAccent3,
      subtitle: t.hero.subtitle3,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-screen min-h-[640px] lg:min-h-[720px] overflow-hidden bg-brand">
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover opacity-45" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/45 to-brand/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand/55 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col justify-end h-full pb-16 lg:pb-24">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-6 items-end">
            <div className="min-h-[240px] lg:min-h-[320px] flex flex-col justify-end max-w-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  <span className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-white/15 bg-white/10 text-[11px] font-semibold tracking-[0.25em] uppercase text-white/80">
                    {t.hero.badge}
                  </span>
                  <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.08] mb-6 sm:mb-8 max-w-[11ch] sm:max-w-none">
                    {slide.title}
                    <br />
                    <span className="text-crocus">{slide.accent}</span>
                  </h1>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-brand text-sm font-medium tracking-wide uppercase rounded-full hover:bg-crocus hover:text-white transition-all duration-300"
                >
                  {t.hero.cta}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/25 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  {t.hero.secondary}
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-col justify-end items-end">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSlide}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-sm text-white/65 leading-relaxed mb-8 text-right max-w-sm"
                >
                  {slide.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: i === currentSlide ? 48 : 24 }}
                  aria-label={`Slide ${i + 1}`}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full" />
                  {i === currentSlide && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 6, ease: 'linear' }}
                      key={`progress-${currentSlide}`}
                    />
                  )}
                </button>
              ))}
              <span className="text-[11px] text-white/40 ml-2 tabular-nums">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white hover:text-white transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white hover:text-white transition-all"
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
