import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Package, MapPin, Heart, LogIn, LogOut, Mail, Lock, Eye, EyeOff,
  ShoppingBag, Settings, ChevronRight, Camera,
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaLine } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { useI18n } from '@/store/i18n';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { useWishlistStore } from '@/store/wishlist';
import { useAddressStore } from '@/store/address';
import { useOrderStore } from '@/store/orders';
import { useToastStore } from '@/store/toast';

type Tab = 'login' | 'register';

/* ── Logged-in Dashboard ── */
function AccountDashboard() {
  const { t, locale } = useI18n();
  const { user, logout } = useAuthStore();
  const profile = useProfileStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const addressCount = useAddressStore((s) => s.addresses.length);
  const orderCount = useOrderStore((s) => s.orders.length);
  const addToast = useToastStore((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const avatarUrl = profile.avatarUrl || user.photoURL || null;
  const displayName = profile.displayName || user.displayName || user.email;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast(locale === 'zh-TW' ? '請選擇圖片檔案' : 'Please select an image', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast(locale === 'zh-TW' ? '檔案不可超過 5MB' : 'Max file size 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      profile.setAvatar(ev.target?.result as string);
      addToast(locale === 'zh-TW' ? '大頭照已更新' : 'Photo updated', 'success');
    };
    reader.readAsDataURL(file);
  };

  const menuItems = [
    { icon: Package, label: t.account.orderTracking, to: '/account/orders' },
    { icon: Heart, label: t.account.wishlist, to: '/wishlist' },
    { icon: MapPin, label: t.account.addressBook, to: '/account/addresses' },
    { icon: Settings, label: locale === 'zh-TW' ? '帳戶設定' : 'Account Settings', to: '/account/settings' },
  ];

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[560px] px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile header */}
          <div className="text-center mb-10">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-crocus/10 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={36} className="text-crocus" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-crocus hover:bg-crocus-hover text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <h1 className="text-xl font-bold text-primary">{displayName}</h1>
            <p className="text-sm text-muted mt-1">{user.email}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: ShoppingBag, label: locale === 'zh-TW' ? '訂單' : 'Orders', value: String(orderCount), to: '/account/orders' },
              { icon: Heart, label: locale === 'zh-TW' ? '收藏' : 'Saved', value: String(wishlistCount), to: '/wishlist' },
              { icon: MapPin, label: locale === 'zh-TW' ? '地址' : 'Addresses', value: String(addressCount), to: '/account/addresses' },
            ].map(({ icon: Icon, label, value, to }) => (
              <Link key={label} to={to} className="rounded-2xl bg-surface-alt p-4 text-center hover:bg-crocus/5 transition-colors">
                <Icon size={18} className="mx-auto mb-2 text-crocus" />
                <p className="text-lg font-bold text-primary">{value}</p>
                <p className="text-[11px] text-muted">{label}</p>
              </Link>
            ))}
          </div>

          {/* Menu items */}
          <div className="rounded-2xl border border-default overflow-hidden mb-8">
            {menuItems.map(({ icon: Icon, label, to }, i) => (
              <Link
                key={label}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-5 py-4 hover:bg-surface-alt transition-colors',
                  i > 0 && 'border-t border-default'
                )}
              >
                <Icon size={18} className="text-crocus" />
                <span className="flex-1 text-sm font-medium text-primary">{label}</span>
                <ChevronRight size={16} className="text-muted" />
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full h-12 border border-default rounded-xl text-sm font-semibold text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            {locale === 'zh-TW' ? '登出' : 'Sign Out'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Login / Register Form ── */
export default function AccountPage() {
  const { t, locale } = useI18n();
  const { user, loading, error, signInWithGoogle, signInWithLine, clearError, initAuth } = useAuthStore();
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crocus border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in, show dashboard
  if (user) return <AccountDashboard />;

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[480px] px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src="/img/lunio logo.png" alt="Lunio" className="h-10 mx-auto" />
            </Link>
            <p className="text-sm text-muted mt-2">{t.account.loginRegister}</p>
          </div>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-alert/10 border border-alert/20 text-sm text-alert flex items-center justify-between"
            >
              <span>{error}</span>
              <button onClick={clearError} className="text-alert hover:text-alert/70 ml-2 font-bold">&times;</button>
            </motion.div>
          )}

          {/* Tab toggle */}
          <div className="flex bg-surface-alt rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map((tKey) => (
              <button
                key={tKey}
                onClick={() => setTab(tKey)}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
                  tab === tKey ? 'bg-surface text-primary shadow-sm' : 'text-muted'
                )}
              >
                {tKey === 'login' ? t.account.login : t.account.register}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.email}</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    className="w-full h-12 pl-11 pr-4 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.password}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 pl-11 pr-11 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder={t.account.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-crocus rounded" />
                  <span className="text-xs text-secondary">{t.account.rememberMe}</span>
                </label>
                <button className="text-xs text-crocus hover:text-crocus-hover transition-colors">
                  {t.account.forgotPassword}
                </button>
              </div>
              <button className="w-full h-12 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                <LogIn size={18} />
                {t.account.login}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-default" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-surface px-3 text-muted">{t.account.orLoginWith}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={signInWithGoogle}
                  className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2"
                >
                  <FcGoogle size={20} /> Google
                </button>
                <button
                  onClick={signInWithLine}
                  className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2"
                >
                  <FaLine size={20} className="text-[#06C755]" /> LINE
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.lastName}</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder={t.account.lastNamePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.firstName}</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder={t.account.firstNamePlaceholder}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.email}</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    className="w-full h-12 pl-11 pr-4 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.mobile}</label>
                <input
                  type="tel"
                  className="w-full h-12 px-4 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                  placeholder="09xx-xxx-xxx"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.password}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 pl-11 pr-11 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder={t.account.passwordRegisterPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 mt-0.5 accent-crocus rounded" />
                <span className="text-xs text-secondary leading-relaxed">
                  {t.account.agreeTerms} <button className="text-crocus hover:underline">{t.account.terms}</button> {t.account.and} <button className="text-crocus hover:underline">{t.account.privacy}</button>
                </span>
              </label>
              <button className="w-full h-12 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                <User size={18} />
                {t.account.createAccount}
              </button>

              {/* Social login for register too */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-default" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-surface px-3 text-muted">{t.account.orLoginWith}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={signInWithGoogle}
                  className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2"
                >
                  <FcGoogle size={20} /> Google
                </button>
                <button
                  onClick={signInWithLine}
                  className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2"
                >
                  <FaLine size={20} className="text-[#06C755]" /> LINE
                </button>
              </div>
            </div>
          )}

          {/* Feature icons */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-default">
            {[
              { icon: Package, label: t.account.orderTracking },
              { icon: MapPin, label: t.account.addressBook },
              { icon: Heart, label: t.account.wishlist },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="mx-auto mb-1.5 text-crocus" />
                <p className="text-[11px] text-muted">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
