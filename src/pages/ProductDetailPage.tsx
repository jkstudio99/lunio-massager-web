import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Check,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Award,
  Zap,
  Heart,
} from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useRecentlyViewedStore } from '@/store/recentlyViewed';
import { useToastStore } from '@/store/toast';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import ProductReviewSection from '@/components/product/ProductReviewSection';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import { useI18n } from '@/store/i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ProductDetailPage() {
  const { t, locale } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const isInCart = useCartStore((s) => s.items.some((item) => item.product.id === product?.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product?.id ?? ''));
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.gallery[0]?.src || '',
      });
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">{t.product.notFound}</h2>
          <Link to="/products" className="text-crocus hover:text-crocus-hover transition-colors">
            {t.product.backToProducts}
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const activeVariant = product.colorVariants?.[selectedVariant];
  const variantGallery = activeVariant?.images ?? [];
  const galleryImages = variantGallery.length > 0
    ? variantGallery
    : product.gallery.length > 0
      ? product.gallery
      : product.cutouts;

  return (
    <div className="bg-surface">
      {/* ───────── 1. BREADCRUMB ───────── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-4">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-primary transition-colors">{t.nav.products}</Link>
          <ChevronRight size={12} />
          <span className="text-primary">{product.name}</span>
        </nav>
      </div>

      {/* ───────── 1. HERO: GALLERY + PRODUCT INFO ───────── */}
      <section className="relative overflow-hidden bg-surface-alt">
        <div className="absolute inset-0 bg-gradient-to-br from-crocus/8 via-transparent to-brand/5" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-[28px] overflow-hidden bg-surface aspect-[4/5] sm:aspect-square mb-4 border border-default">
                <img
                  src={galleryImages[activeImage]?.src ?? product.heroImage.src}
                  alt={galleryImages[activeImage]?.alt[locale] ?? product.name}
                  className="w-full h-full object-cover"
                />
                {product.comparePrice && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-alert text-white text-xs font-bold rounded-full">
                    {t.product.save} {formatPrice(product.comparePrice - product.price)}
                  </span>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-crocus' : 'border-transparent bg-surface'
                    }`}
                  >
                    <img src={img.src} alt={img.alt[locale]} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-1 lg:order-2 lg:pt-2"
            >
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {product.isNew && (
                  <span className="px-2.5 py-1 bg-brand text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {t.product.new}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-2.5 py-1 bg-crocus text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {t.product.bestSeller}
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-1 tracking-[-0.03em] leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-muted mb-6 tracking-wide">{product.nameEn}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? 'fill-crocus text-crocus' : 'text-light-gray'}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{product.rating}</span>
                <span className="text-sm text-muted">({product.reviewCount} {t.product.ratingLabel})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 flex-wrap">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-lg text-muted line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                    <span className="px-2 py-0.5 bg-alert/10 text-alert text-xs font-bold rounded">
                      -{getDiscountPercent(product.price, product.comparePrice)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-secondary leading-relaxed mb-6">{product.shortDescription}</p>

              {/* Color Variants */}
              {product.colorVariants && product.colorVariants.length > 1 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    {t.product.selectColor} — {activeVariant?.name[locale]}
                  </p>
                  <div className="flex gap-3">
                    {product.colorVariants.map((variant, i) => (
                      <button
                        key={variant.id}
                        onClick={() => { setSelectedVariant(i); setActiveImage(0); }}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          selectedVariant === i
                            ? 'border-crocus scale-110 shadow-lg'
                            : 'border-default hover:border-crocus/50'
                        }`}
                        style={{ backgroundColor: variant.colorHex }}
                        title={variant.name[locale]}
                      >
                        {selectedVariant === i && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check size={14} className={variant.colorHex === '#f5f5f0' || variant.colorHex === '#f4c2d0' ? 'text-gray-700' : 'text-white'} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="space-y-2 mb-8">
                {product.features.slice(0, 4).map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check size={16} className="text-success flex-shrink-0" />
                    <span className="text-sm text-secondary">{f[locale]}</span>
                  </div>
                ))}
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                <div className="flex items-center border border-default rounded-full bg-surface overflow-hidden w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-secondary hover:bg-surface-alt transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-secondary hover:bg-surface-alt transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    addItem(product, quantity);
                    openDrawer();
                    setQuantity(1);
                    addToast(t.toast.addedToCart, 'success');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 h-12 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all hover:scale-[1.01] shadow-lg shadow-crocus/20"
                >
                  <ShoppingBag size={18} />
                  {isInCart ? t.product.addedToCart : t.product.addToCart}
                </button>
              </div>

              {/* Wishlist button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!product) return;
                  const wasInWishlist = isInWishlist;
                  toggleWishlist(product);
                  addToast(wasInWishlist ? t.toast.removedFromWishlist : t.toast.addedToWishlist, wasInWishlist ? 'info' : 'success');
                }}
                className={`flex w-full items-center justify-center gap-2 h-11 rounded-full border text-sm font-medium transition-all mb-6 ${
                  isInWishlist
                    ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400'
                    : 'border-default text-secondary hover:border-crocus hover:text-crocus'
                }`}
              >
                <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
                {isInWishlist ? t.wishlist.inWishlist : t.wishlist.addToWishlist}
              </motion.button>

              <div className="flex items-center gap-2 rounded-2xl border border-default bg-surface-alt px-4 py-3 text-xs text-secondary mb-6">
                <Check size={14} className="text-success shrink-0" />
                {t.product.autoOpenCartHint}
              </div>

              <p className="text-xs text-success mb-6 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                {t.product.inStock} — {t.product.stock} {product.stock} {t.product.pieces}
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 bg-surface rounded-2xl border border-default">
                {[
                  { icon: Truck, text: t.product.freeShipping },
                  { icon: Shield, text: t.product.yearWarranty },
                  { icon: RefreshCw, text: t.product.returnPolicy },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="text-center">
                    <Icon size={18} className="mx-auto mb-1 text-crocus" />
                    <span className="text-[11px] text-secondary font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── 2. CINEMATIC BANNER ───────── */}
      {product.heroImages.length > 0 && (
        <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
          <img
            src={product.heroImages[0].src}
            alt={product.heroImages[0].alt[locale]}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] mb-4">
              {product.name}
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
              {product.cta.note[locale]}
            </p>
          </motion.div>
        </section>
      )}

      {/* ───────── 3. USP / KEY BENEFITS ───────── */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-crocus font-semibold mb-3">
              {t.product.whyChoose} {product.name}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-[-0.03em]">
              {t.product.keyBenefits}
            </motion.h2>
          </motion.div>

          <div className="space-y-20 lg:space-y-28">
            {product.usp.map((item, i) => {
              const isEven = i % 2 === 0;
              const sceneImg = product.usageScenes[i] ?? product.usageScenes[0];
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={stagger}
                  className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                    isEven ? '' : 'lg:[direction:rtl]'
                  }`}
                >
                  <motion.div
                    variants={fadeUp}
                    className={`overflow-hidden rounded-3xl ${isEven ? '' : 'lg:[direction:ltr]'}`}
                  >
                    <img
                      src={sceneImg.src}
                      alt={sceneImg.alt[locale]}
                      className="w-full aspect-[4/5] sm:aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} className={`lg:[direction:ltr] ${isEven ? '' : ''}`}>
                    {item.eyebrow && (
                      <span className="inline-block text-xs uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: product.theme.accent }}>
                        {item.eyebrow[locale]}
                      </span>
                    )}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4 tracking-[-0.02em] leading-snug">
                      {item.title[locale]}
                    </h3>
                    <p className="text-secondary leading-relaxed text-sm sm:text-base max-w-lg">
                      {item.description[locale]}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── 4. STATS STRIP ───────── */}
      {product.stats.length > 0 && (
        <section
          className="py-14 lg:py-20"
          style={{ background: `linear-gradient(135deg, ${product.theme.accent}, ${product.theme.accentSoft})` }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="mx-auto max-w-[1400px] px-6 lg:px-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
              {product.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-1">
                    {stat.label[locale]}
                  </p>
                  {stat.description && (
                    <p className="text-white/60 text-xs">
                      {stat.description[locale]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ───────── 5. FEATURE BENTO GRID ───────── */}
      <section className="py-20 lg:py-28 bg-surface-alt">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-primary tracking-[-0.03em]">
              {t.product.features}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]"
          >
            {/* Feature text cards */}
            {product.features.map((feature, i) => {
              const icons = [Zap, Heart, Shield, Award, Check, Star];
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="relative overflow-hidden rounded-3xl border border-default bg-surface p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: product.theme.accentMute }}
                  >
                    <Icon size={18} style={{ color: product.theme.accent }} />
                  </div>
                  <p className="text-sm font-semibold text-primary leading-snug">{feature[locale]}</p>
                </motion.div>
              );
            })}

            {/* Additional cutout card removed */}
          </motion.div>
        </div>
      </section>

      {/* ───────── 6. MASSAGE MODES ───────── */}
      {product.modes.length > 0 && (
        <section className="py-20 lg:py-28 bg-surface">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: product.theme.accent }}>
                {t.product.modesDesc}
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-primary tracking-[-0.03em]">
                {t.product.massageModes}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* Mode detail media */}
              <motion.div variants={fadeUp} className="order-2 lg:order-1">
                {product.detailMedia?.structure ? (
                  <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: product.theme.surface }}>
                    <img
                      src={product.detailMedia.structure.src}
                      alt={product.detailMedia.structure.alt[locale]}
                      className="w-full aspect-square object-contain p-8"
                    />
                  </div>
                ) : product.cutouts[0] ? (
                  <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: product.theme.surface }}>
                    <img
                      src={product.cutouts[0].src}
                      alt={product.cutouts[0].alt[locale]}
                      className="w-full aspect-square object-contain p-8"
                    />
                  </div>
                ) : null}
              </motion.div>

              {/* Mode cards */}
              <motion.div variants={fadeUp} className="order-1 lg:order-2 space-y-4">
                {product.modes.map((mode, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMode(i)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                      activeMode === i
                        ? 'border-crocus bg-surface-alt shadow-lg'
                        : 'border-default bg-surface hover:border-crocus/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          activeMode === i ? 'text-white' : 'text-white/80'
                        }`}
                        style={{ backgroundColor: activeMode === i ? product.theme.accent : product.theme.accentSoft }}
                      >
                        {i + 1}
                      </div>
                      <h3 className="text-lg font-bold text-primary">{mode.name[locale]}</h3>
                    </div>
                    <AnimatePresence>
                      {activeMode === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-secondary leading-relaxed pl-11"
                        >
                          {mode.description[locale]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ───────── 7. PRODUCT COMPARISON ───────── */}
      {relatedProducts.length > 0 && (
        <section className="py-20 lg:py-28 bg-surface-alt">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-primary tracking-[-0.03em]">
                {t.product.compareTitle}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {[product, relatedProducts[0]].map((p, i) => (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  custom={i}
                  className={`rounded-3xl border p-8 text-center ${
                    i === 0 ? 'border-crocus bg-surface shadow-xl' : 'border-default bg-surface'
                  }`}
                >
                  {i === 0 && (
                    <span className="inline-block px-3 py-1 bg-crocus text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">
                      {locale === 'zh-TW' ? '目前瀏覽' : 'Current'}
                    </span>
                  )}
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: p.theme.surface }}>
                    <img
                      src={p.cutouts[0]?.src ?? p.heroImage.src}
                      alt={p.cutouts[0]?.alt[locale] ?? p.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">{p.name}</h3>
                  <p className="text-xs text-muted mb-4">{p.nameEn}</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className={j < Math.floor(p.rating) ? 'fill-crocus text-crocus' : 'text-light-gray'}
                      />
                    ))}
                    <span className="text-xs text-muted ml-1">({p.reviewCount})</span>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-4">{formatPrice(p.price)}</p>
                  <ul className="space-y-2 text-left">
                    {p.features.slice(0, 4).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-secondary">
                        <Check size={14} className="text-success shrink-0" />
                        {f[locale]}
                      </li>
                    ))}
                  </ul>
                  {i === 1 && (
                    <Link
                      to={`/product/${p.slug}`}
                      className="inline-block mt-6 px-6 py-2.5 border border-crocus text-crocus text-sm font-semibold rounded-full hover:bg-crocus hover:text-white transition-all"
                    >
                      {t.sections.viewDetail}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ───────── 8. FAQ ACCORDION ───────── */}
      {product.faq.length > 0 && (
        <section className="py-20 lg:py-28 bg-surface">
          <div className="mx-auto max-w-[800px] px-6 lg:px-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-primary tracking-[-0.03em] mb-3">
                {t.product.faqTitle}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-secondary text-sm">
                {t.product.faqDesc}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="space-y-3"
            >
              {product.faq.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="border border-default rounded-2xl overflow-hidden bg-surface"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-primary text-sm sm:text-base pr-4">
                      {item.question[locale]}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaqIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0"
                    >
                      <ChevronDown size={18} className="text-muted" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 text-sm text-secondary leading-relaxed border-t border-default pt-4">
                          {item.answer[locale]}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ───────── 9. CERTIFICATION MARQUEE ───────── */}
      {product.certifications.length > 0 && (
        <section className="py-10 bg-surface-alt border-y border-default overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-center text-xs uppercase tracking-[0.2em] text-muted font-semibold mb-6">
              {t.product.certTitle}
            </p>
            <div className="relative">
              <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  x: { repeat: Infinity, repeatType: 'loop', duration: 20, ease: 'linear' },
                }}
              >
                {/* Duplicate for seamless loop */}
                {[...product.certifications, ...product.certifications, ...product.certifications, ...product.certifications].map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-3">
                    <Award size={20} style={{ color: product.theme.accent }} />
                    <span className="text-sm font-semibold text-primary tracking-wide">{cert}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ───────── 10. CTA BANNER ───────── */}
      <section
        className="py-20 lg:py-28"
        style={{ background: `linear-gradient(135deg, ${product.theme.accent}, ${product.theme.contrast})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[800px] px-6 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em] mb-4">
            {product.name}
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
            {product.cta.note[locale]}
          </p>
          <button
            onClick={() => {
              addItem(product, 1);
              openDrawer();
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-[1.02] shadow-xl"
          >
            <ShoppingBag size={18} />
            {product.cta.primary[locale]}
          </button>
        </motion.div>
      </section>

      {/* ───────── 11. PRODUCT REVIEWS ───────── */}
      <ProductReviewSection productId={product.id} />

      {/* ───────── 12. RECENTLY VIEWED ───────── */}
      <RecentlyViewed excludeId={product.id} />

      {/* ───────── 13. RELATED PRODUCTS ───────── */}
      {relatedProducts.length > 0 && (
        <section className="py-20 lg:py-28 bg-surface">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-primary mb-10 text-center"
            >
              {t.product.relatedProducts}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
