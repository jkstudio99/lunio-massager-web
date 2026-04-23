import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products, categories, reviews } from '@/data/products';
import { useI18n } from '@/store/i18n';
import heroCover1 from '@/assets/img/Cover.jpg';
import heroCover2 from '@/assets/img/Cover2.jpg';

const heroCover3 = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&h=1080&fit=crop';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

export default function HomePage() {
  const { t } = useI18n();
  const featured = products.filter((p) => p.isBestSeller);

  const steps = [
    { step: '01', title: t.steps.s1, desc: t.steps.s1d },
    { step: '02', title: t.steps.s2, desc: t.steps.s2d },
    { step: '03', title: t.steps.s3, desc: t.steps.s3d },
    { step: '04', title: t.steps.s4, desc: t.steps.s4d },
  ];

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

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];

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

  return (
    <>
      {/* Hero — Full-screen cinematic carousel */}
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-black">
        {/* Background images with crossfade */}
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
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover opacity-55"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full pb-20 lg:pb-28">
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div className="min-h-[280px] lg:min-h-[320px] flex flex-col justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.15] mb-8">
                      {slide.title}
                      <br />
                      <span className="text-crocus">{slide.accent}</span>
                    </h1>
                  </motion.div>
                </AnimatePresence>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/products"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-medium tracking-wide uppercase rounded-full hover:bg-crocus hover:text-white transition-all duration-300"
                  >
                    {t.hero.cta}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:border-white hover:bg-white/10 transition-all duration-300"
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
                    className="text-sm text-white/60 leading-relaxed mb-8 text-right max-w-sm"
                  >
                    {slide.subtitle}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Pagination & Navigation */}
          <div className="absolute bottom-8 left-0 right-0 z-20">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex items-center justify-between">
              {/* Pagination dots + progress */}
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

              {/* Arrow navigation */}
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


      {/* Benefits — 3 Massage Styles */}
      <section className="py-20 lg:py-28 bg-surface transition-colors">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {/* Heading */}
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-[-0.02em] leading-tight">
              {t.benefits.heading}
            </h2>
            <p className="text-xl sm:text-2xl font-medium text-secondary mt-2">{t.benefits.subheading}</p>
            <p className="text-sm sm:text-base text-muted mt-4 max-w-lg mx-auto leading-relaxed">
              {t.benefits.desc}
            </p>
          </motion.div>

          {/* 3 Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
            {/* Smart Relax */}
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1.5" className="text-crocus/20" />
                  <path d="M28 44c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-crocus" />
                  <circle cx="40" cy="44" r="3" fill="currentColor" className="text-crocus" />
                  <path d="M33 36c-2-3-2-7 1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-crocus/60" />
                  <path d="M40 33c0-4 0-8 0-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-crocus/60" />
                  <path d="M47 36c2-3 2-7-1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-crocus/60" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">{t.benefits.b1Title}</h3>
              <p className="text-xs font-medium tracking-widest uppercase text-crocus mb-3">({t.benefits.b1Sub})</p>
              <p className="text-sm text-secondary leading-relaxed max-w-[260px]">{t.benefits.b1Desc}</p>
            </motion.div>

            {/* Deep Tissue */}
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.12 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1.5" className="text-crocus/20" />
                  <path d="M30 50V34a2 2 0 012-2h16a2 2 0 012 2v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-crocus" />
                  <path d="M34 42h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-crocus" />
                  <path d="M34 38h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-crocus" />
                  <path d="M34 46h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-crocus" />
                  <path d="M26 50h28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-crocus" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">{t.benefits.b2Title}</h3>
              <p className="text-xs font-medium tracking-widest uppercase text-crocus mb-3">({t.benefits.b2Sub})</p>
              <p className="text-sm text-secondary leading-relaxed max-w-[260px]">{t.benefits.b2Desc}</p>
            </motion.div>

            {/* Precision Point */}
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.24 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1.5" className="text-crocus/20" />
                  <circle cx="40" cy="40" r="12" stroke="currentColor" strokeWidth="2" className="text-crocus" />
                  <circle cx="40" cy="40" r="4" fill="currentColor" className="text-crocus" />
                  <path d="M40 22v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-crocus/60" />
                  <path d="M40 50v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-crocus/60" />
                  <path d="M22 40h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-crocus/60" />
                  <path d="M50 40h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-crocus/60" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">{t.benefits.b3Title}</h3>
              <p className="text-xs font-medium tracking-widest uppercase text-crocus mb-3">({t.benefits.b3Sub})</p>
              <p className="text-sm text-secondary leading-relaxed max-w-[260px]">{t.benefits.b3Desc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections — product showcase */}
      <section className="py-16 sm:py-24 lg:py-32 transition-colors bg-surface-alt">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="flex items-end justify-between mb-8 sm:mb-14">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-2 sm:mb-3">Collections</p>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">{t.sections.categories}</h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-xs sm:text-sm font-medium text-muted hover:text-crocus transition-colors"
            >
              {t.sections.viewAll} <ChevronRight size={16} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story — cinematic editorial */}
      <section className="py-0 transition-colors">
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          <motion.div
            {...fadeInUp}
            className="relative overflow-hidden"
          >
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

      {/* Best Sellers */}
      <section className="py-16 sm:py-24 lg:py-32 transition-colors bg-surface">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="flex items-end justify-between mb-8 sm:mb-14">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-2 sm:mb-3">Popular</p>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">{t.sections.bestSellers}</h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-xs sm:text-sm font-medium text-muted hover:text-crocus transition-colors"
            >
              {t.sections.viewAll} <ChevronRight size={16} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works — fashion minimal */}
      <section className="py-24 lg:py-32 bg-brand text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-3">Process</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-[-0.03em]">{t.sections.howItWorks}</h2>
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


      {/* Reviews — editorial style */}
      <section className="py-24 lg:py-32 bg-surface-alt transition-colors">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus mb-3">Testimonials</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">{t.sections.reviews}</h2>
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

      {/* CTA — full-width cinematic */}
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
    </>
  );
}
