import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, LogIn, Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/store/i18n';

type Tab = 'login' | 'register';

export default function AccountPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);

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
                    className="w-full h-12 pl-11 pr-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
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
                    className="w-full h-12 pl-11 pr-11 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
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
                <button className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2">
                  <Mail size={18} className="text-[#4285F4]" /> Google
                </button>
                <button className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={18} className="text-[#00B900]" /> LINE
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
                    className="w-full h-12 px-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder={t.account.lastNamePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.firstName}</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
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
                    className="w-full h-12 pl-11 pr-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.mobile}</label>
                <input
                  type="tel"
                  className="w-full h-12 px-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                  placeholder="09xx-xxx-xxx"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">{t.account.password}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 pl-11 pr-11 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
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
