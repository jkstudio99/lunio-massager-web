import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'login' | 'register';

export default function AccountPage() {
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
            <p className="text-sm text-muted mt-2">會員登入 / 註冊</p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-surface-alt rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
                  tab === t ? 'bg-surface text-primary shadow-sm' : 'text-muted'
                )}
              >
                {t === 'login' ? '登入' : '註冊'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Email</label>
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
                <label className="block text-xs font-medium text-secondary mb-1.5">密碼</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 pl-11 pr-11 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder="請輸入密碼"
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
                  <span className="text-xs text-secondary">記住我</span>
                </label>
                <button className="text-xs text-crocus hover:text-crocus-hover transition-colors">
                  忘記密碼？
                </button>
              </div>
              <button className="w-full h-12 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                <LogIn size={18} />
                登入
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-default" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-surface px-3 text-muted">或使用以下方式登入</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2">
                  <span className="text-lg">🔵</span> Google
                </button>
                <button className="h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2">
                  <span className="text-lg">💚</span> LINE
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">姓</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder="王"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1.5">名</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder="小明"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Email</label>
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
                <label className="block text-xs font-medium text-secondary mb-1.5">手機號碼</label>
                <input
                  type="tel"
                  className="w-full h-12 px-4 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                  placeholder="09xx-xxx-xxx"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">密碼</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 pl-11 pr-11 border border-default rounded-lg focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                    placeholder="至少 8 個字元"
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
                  我同意 Lunio 的<button className="text-crocus hover:underline">服務條款</button>與
                  <button className="text-crocus hover:underline">隱私權政策</button>
                </span>
              </label>
              <button className="w-full h-12 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                <User size={18} />
                建立帳號
              </button>
            </div>
          )}

          {/* Feature icons */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-default">
            {[
              { icon: Package, label: '訂單追蹤' },
              { icon: MapPin, label: '地址管理' },
              { icon: Heart, label: '收藏清單' },
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
