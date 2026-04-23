import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useTheme } from '@/store/theme';
import { useI18n } from '@/store/i18n';
import { localeNames, type Locale } from '@/i18n/translations';
import { cn } from '@/lib/utils';

const navLinks = [
  { key: 'home' as const, path: '/' },
  { key: 'products' as const, path: '/products' },
  { key: 'about' as const, path: '/about' },
  { key: 'blog' as const, path: '/blog' },
  { key: 'support' as const, path: '/support' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isTransparentPage = isHome || isAbout;
  const isTransparent = isTransparentPage && !scrolled && !mobileOpen && !searchOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-all',
                  isTransparent
                    ? location.pathname === link.path
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                    : location.pathname === link.path
                      ? 'text-primary'
                      : 'text-muted hover:text-primary'
                )}
              >
                {t.nav[link.key]}
              </Link>
            ))}
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
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2.5 transition-colors',
                isTransparent ? 'text-white/60 hover:text-white' : 'text-muted hover:text-primary'
              )}
              aria-label={theme === 'light' ? t.theme.dark : t.theme.light}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
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

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-default bg-surface px-6 py-4 transition-colors">
          <div className="mx-auto max-w-[640px]">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder={t.nav.search}
                className="w-full h-11 pl-12 pr-5 bg-surface-alt border border-default rounded-full focus:outline-none focus:ring-2 focus:ring-crocus/30 text-sm text-primary placeholder:text-muted transition-colors"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-default bg-surface transition-colors">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'py-3 px-4 text-sm font-medium tracking-wide uppercase transition-colors',
                  location.pathname === link.path
                    ? 'text-crocus'
                    : 'text-secondary hover:text-primary'
                )}
              >
                {t.nav[link.key]}
              </Link>
            ))}
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
