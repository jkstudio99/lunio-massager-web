import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Globe, ChevronDown, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useSearchStore } from '@/store/search';
import { useTheme } from '@/store/theme';
import { useI18n } from '@/store/i18n';
import ThemeToggle from '@/components/common/ThemeToggle';
import { localeNames, type Locale } from '@/i18n/translations';
import { cn } from '@/lib/utils';

/* ── Product dropdown items ── */
const productDropdown = [
  {
    slug: 'boot-massager',
    label: { 'zh-TW': '靴型按摩器', en: 'Boot Massager' },
    image: '/media/products/boot/1.png',
  },
  {
    slug: 'calf-massager',
    label: { 'zh-TW': '小腿按摩器', en: 'Calf Massager' },
    image: '/media/products/calf/1.png',
  },
  {
    slug: 'neck-shoulder',
    label: { 'zh-TW': '頸肩按摩器', en: 'Neck & Shoulder' },
    image: '/media/products/neck/4.png',
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prodRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const theme = useTheme((s) => s.theme);
  const { locale, setLocale, t } = useI18n();

  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isTransparentPage = isHome || isAbout;
  const isTransparent = isTransparentPage && !scrolled && !mobileOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close product dropdown on click outside
  useEffect(() => {
    if (!prodOpen) return;
    const handler = (e: MouseEvent) => {
      if (prodRef.current && !prodRef.current.contains(e.target as Node)) setProdOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [prodOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProdOpen(false);
  }, [location.pathname]);

  const linkCls = (active: boolean) =>
    cn(
      'px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-all',
      isTransparent
        ? active ? 'text-white' : 'text-white/60 hover:text-white'
        : active ? 'text-primary' : 'text-muted hover:text-primary'
    );

  const isActive = (path: string) => location.pathname === path;
  const isProductActive = location.pathname.startsWith('/product');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-surface/90 backdrop-blur-xl border-b border-default shadow-sm'
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'lg:hidden p-2 -ml-2 transition-colors',
              isTransparent ? 'text-white hover:text-crocus' : 'text-primary hover:text-crocus'
            )}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/img/lunio logo.png"
              alt="Lunio"
              className={cn(
                'h-6 sm:h-7 transition-all',
                isTransparent
                  ? 'brightness-0 invert'
                  : theme === 'dark' ? 'brightness-0 invert' : ''
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Home */}
            <Link to="/" className={linkCls(isActive('/'))}>
              {t.nav.home}
            </Link>

            {/* Products — dropdown */}
            <div ref={prodRef} className="relative">
              <button
                onClick={() => setProdOpen(!prodOpen)}
                onMouseEnter={() => setProdOpen(true)}
                className={cn(
                  linkCls(isProductActive),
                  'inline-flex items-center gap-1'
                )}
              >
                {t.nav.products}
                <ChevronDown
                  size={13}
                  className={cn('transition-transform duration-200', prodOpen && 'rotate-180')}
                />
              </button>

              {/* Dropdown panel */}
              <div
                onMouseLeave={() => setProdOpen(false)}
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200',
                  prodOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                )}
              >
                <div className="w-[320px] bg-surface-elevated border border-default rounded-2xl shadow-2xl overflow-hidden">
                  {/* View all */}
                  <Link
                    to="/products"
                    onClick={() => setProdOpen(false)}
                    className="block px-5 py-3 text-xs font-semibold text-crocus uppercase tracking-wider border-b border-default hover:bg-crocus/5 transition-colors"
                  >
                    {locale === 'zh-TW' ? '查看所有產品 →' : 'View All Products →'}
                  </Link>

                  {/* Product items */}
                  <div className="p-2">
                    {productDropdown.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/product/${item.slug}`}
                        onClick={() => setProdOpen(false)}
                        className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-surface-alt transition-all group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-surface-alt flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-crocus/5 transition-colors">
                          <img
                            src={item.image}
                            alt={item.label[locale as 'zh-TW' | 'en']}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary group-hover:text-crocus transition-colors">
                            {item.label[locale as 'zh-TW' | 'en']}
                          </p>
                          <p className="text-[11px] text-muted mt-0.5">Lunio {item.label.en}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <Link to="/reviews" className={linkCls(isActive('/reviews'))}>
              {locale === 'zh-TW' ? '評價' : 'Reviews'}
            </Link>

            {/* FAQ */}
            <Link to="/support" className={linkCls(isActive('/support'))}>
              {locale === 'zh-TW' ? '常見問題' : 'FAQ'}
            </Link>

            {/* Blog */}
            <Link to="/blog" className={linkCls(isActive('/blog') || location.pathname.startsWith('/blog/'))}>
              {t.nav.blog}
            </Link>

            {/* Store */}
            <Link to="/store" className={linkCls(isActive('/store'))}>
              {locale === 'zh-TW' ? '門市據點' : 'Store'}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-2 transition-colors',
                  isTransparent ? 'text-white/60 hover:text-white' : 'text-muted hover:text-primary'
                )}
              >
                <Globe size={18} />
                <span className="text-[11px] font-medium uppercase">{locale.split('-')[0]}</span>
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] bg-surface-elevated border border-default rounded-lg shadow-xl overflow-hidden">
                    {(Object.keys(localeNames) as Locale[]).map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { setLocale(loc); setLangOpen(false); }}
                        className={cn(
                          'w-full px-4 py-2.5 text-left text-sm transition-colors',
                          locale === loc
                            ? 'text-crocus bg-crocus/5 font-medium'
                            : 'text-secondary hover:bg-surface-alt'
                        )}
                      >
                        {localeNames[loc]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme toggle */}
            <ThemeToggle transparent={isTransparent} />

            <button
              onClick={() => useSearchStore.getState().openSearch()}
              className={cn(
                'p-2.5 transition-colors',
                isTransparent ? 'text-white/60 hover:text-white' : 'text-muted hover:text-primary'
              )}
              aria-label={t.nav.search}
            >
              <Search size={18} />
            </button>

            <Link
              to="/account"
              className={cn(
                'hidden sm:flex p-2.5 transition-colors',
                isTransparent ? 'text-white/60 hover:text-white' : 'text-muted hover:text-primary'
              )}
              aria-label={t.nav.account}
            >
              <User size={18} />
            </Link>

            <Link
              to="/wishlist"
              className={cn(
                'relative hidden sm:flex p-2.5 transition-colors',
                isTransparent ? 'text-white/60 hover:text-white' : 'text-muted hover:text-primary'
              )}
              aria-label={t.wishlist?.viewWishlist ?? 'Wishlist'}
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crocus px-1 text-white text-[9px] font-bold">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => useCartStore.getState().openDrawer()}
              className={cn(
                'relative p-2.5 transition-colors',
                isTransparent ? 'text-white/60 hover:text-white' : 'text-muted hover:text-primary'
              )}
              aria-label={t.nav.cart}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crocus px-1 text-white text-[9px] font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-default bg-surface transition-colors">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {/* Home */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'py-3 px-4 text-sm font-medium tracking-wide uppercase transition-colors',
                isActive('/') ? 'text-crocus' : 'text-secondary hover:text-primary'
              )}
            >
              {t.nav.home}
            </Link>

            {/* Products — expandable */}
            <div>
              <button
                onClick={() => setMobileProdOpen(!mobileProdOpen)}
                className={cn(
                  'w-full flex items-center justify-between py-3 px-4 text-sm font-medium tracking-wide uppercase transition-colors',
                  isProductActive ? 'text-crocus' : 'text-secondary hover:text-primary'
                )}
              >
                {t.nav.products}
                <ChevronDown
                  size={16}
                  className={cn('transition-transform duration-200', mobileProdOpen && 'rotate-180')}
                />
              </button>

              {mobileProdOpen && (
                <div className="ml-4 border-l-2 border-crocus/20 pl-4 pb-2 space-y-1">
                  <Link
                    to="/products"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 text-xs font-semibold text-crocus uppercase tracking-wider"
                  >
                    {locale === 'zh-TW' ? '查看所有 →' : 'View All →'}
                  </Link>
                  {productDropdown.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/product/${item.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-alt transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
                        <img src={item.image} alt="" className="w-8 h-8 object-contain" />
                      </div>
                      <span className="text-sm text-primary font-medium">
                        {item.label[locale as 'zh-TW' | 'en']}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <Link
              to="/reviews"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'py-3 px-4 text-sm font-medium tracking-wide uppercase transition-colors',
                isActive('/reviews') ? 'text-crocus' : 'text-secondary hover:text-primary'
              )}
            >
              {locale === 'zh-TW' ? '評價' : 'Reviews'}
            </Link>

            {/* FAQ */}
            <Link
              to="/support"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'py-3 px-4 text-sm font-medium tracking-wide uppercase transition-colors',
                isActive('/support') ? 'text-crocus' : 'text-secondary hover:text-primary'
              )}
            >
              {locale === 'zh-TW' ? '常見問題' : 'FAQ'}
            </Link>

            {/* Blog */}
            <Link
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'py-3 px-4 text-sm font-medium tracking-wide uppercase transition-colors',
                isActive('/blog') ? 'text-crocus' : 'text-secondary hover:text-primary'
              )}
            >
              {t.nav.blog}
            </Link>

            {/* Store */}
            <Link
              to="/store"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'py-3 px-4 text-sm font-medium tracking-wide uppercase transition-colors',
                isActive('/store') ? 'text-crocus' : 'text-secondary hover:text-primary'
              )}
            >
              {locale === 'zh-TW' ? '門市據點' : 'Store'}
            </Link>

            {/* Mobile language selector */}
            <div className="pt-3 mt-2 border-t border-default">
              <div className="flex gap-2">
                {(Object.keys(localeNames) as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setLocale(loc); setMobileOpen(false); }}
                    className={cn(
                      'flex-1 py-2 text-xs font-medium rounded-lg transition-colors',
                      locale === loc
                        ? 'bg-crocus text-white'
                        : 'bg-surface-alt text-secondary'
                    )}
                  >
                    {localeNames[loc]}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
