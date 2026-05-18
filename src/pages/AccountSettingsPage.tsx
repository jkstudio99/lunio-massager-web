import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Camera, User, Mail, Phone, Calendar, Users,
  Save, Shield, Bell, Moon, Sun, Globe, ChevronRight,
} from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { useTheme } from '@/store/theme';
import { useToastStore } from '@/store/toast';
import { cn } from '@/lib/utils';

export default function AccountSettingsPage() {
  const { locale, setLocale } = useI18n();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const profile = useProfileStore();
  const addToast = useToastStore((s) => s.addToast);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  // Local form state seeded from store / auth
  const [form, setForm] = useState({
    displayName: profile.displayName || user?.displayName || '',
    phone: profile.phone,
    birthday: profile.birthday,
    gender: profile.gender,
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  });

  const avatarUrl = profile.avatarUrl || user?.photoURL || null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      addToast(locale === 'zh-TW' ? '請選擇圖片檔案' : 'Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast(locale === 'zh-TW' ? '檔案大小不可超過 5MB' : 'File size must be under 5MB', 'error');
      return;
    }

    // Create data URL for local storage
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      profile.setAvatar(result);
      addToast(locale === 'zh-TW' ? '大頭照已更新' : 'Profile photo updated', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    setSaving(true);
    // Simulate save delay
    setTimeout(() => {
      profile.updateProfile({
        displayName: form.displayName,
        phone: form.phone,
        birthday: form.birthday,
        gender: form.gender,
      });
      setSaving(false);
      addToast(locale === 'zh-TW' ? '個人資料已更新' : 'Profile updated successfully', 'success');
    }, 600);
  };

  const t = {
    back: locale === 'zh-TW' ? '返回帳戶' : 'Back to Account',
    title: locale === 'zh-TW' ? '帳戶設定' : 'Account Settings',
    profileSection: locale === 'zh-TW' ? '個人資料' : 'Personal Info',
    changePhoto: locale === 'zh-TW' ? '更換大頭照' : 'Change Photo',
    displayName: locale === 'zh-TW' ? '顯示名稱' : 'Display Name',
    email: locale === 'zh-TW' ? 'Email' : 'Email',
    phone: locale === 'zh-TW' ? '手機號碼' : 'Phone',
    birthday: locale === 'zh-TW' ? '生日' : 'Birthday',
    gender: locale === 'zh-TW' ? '性別' : 'Gender',
    genderOptions: locale === 'zh-TW'
      ? [{ v: '', l: '請選擇' }, { v: 'male', l: '男' }, { v: 'female', l: '女' }, { v: 'other', l: '其他' }]
      : [{ v: '', l: 'Select' }, { v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'other', l: 'Other' }],
    save: locale === 'zh-TW' ? '儲存變更' : 'Save Changes',
    saving: locale === 'zh-TW' ? '儲存中...' : 'Saving...',
    prefsSection: locale === 'zh-TW' ? '偏好設定' : 'Preferences',
    theme: locale === 'zh-TW' ? '主題' : 'Theme',
    language: locale === 'zh-TW' ? '語言' : 'Language',
    notifSection: locale === 'zh-TW' ? '通知設定' : 'Notifications',
    orderUpdates: locale === 'zh-TW' ? '訂單狀態更新' : 'Order Updates',
    promotions: locale === 'zh-TW' ? '優惠活動通知' : 'Promotions',
    newsletter: locale === 'zh-TW' ? '電子報' : 'Newsletter',
    securitySection: locale === 'zh-TW' ? '安全性' : 'Security',
    changePassword: locale === 'zh-TW' ? '變更密碼' : 'Change Password',
    twoFactor: locale === 'zh-TW' ? '兩步驟驗證' : 'Two-Factor Auth',
    deleteAccount: locale === 'zh-TW' ? '刪除帳號' : 'Delete Account',
    signOut: locale === 'zh-TW' ? '登出' : 'Sign Out',
  };

  const inputCls = 'w-full h-11 px-4 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm';

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[680px] px-6 py-10 lg:py-16">
        <Link to="/account" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-crocus transition-colors mb-6">
          <ArrowLeft size={16} />
          {t.back}
        </Link>

        <h1 className="text-2xl font-bold text-primary mb-8 tracking-[-0.02em]">{t.title}</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* ── Profile Section ── */}
          <section className="p-6 rounded-2xl border border-default">
            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
              <User size={18} className="text-crocus" />
              {t.profileSection}
            </h2>

            {/* Avatar upload */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-crocus/10 flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={32} className="text-crocus" />
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
              <div>
                <p className="text-sm font-semibold text-primary">
                  {form.displayName || user?.email}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-crocus hover:text-crocus-hover mt-1 font-medium transition-colors"
                >
                  {t.changePhoto}
                </button>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
                  <User size={12} /> {t.displayName}
                </label>
                <input
                  className={inputCls}
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
                  <Mail size={12} /> {t.email}
                </label>
                <input
                  className={cn(inputCls, 'bg-surface-alt text-muted cursor-not-allowed')}
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
                    <Phone size={12} /> {t.phone}
                  </label>
                  <input
                    className={inputCls}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="09xx-xxx-xxx"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
                    <Calendar size={12} /> {t.birthday}
                  </label>
                  <input
                    type="date"
                    className={inputCls}
                    value={form.birthday}
                    onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
                  <Users size={12} /> {t.gender}
                </label>
                <select
                  className={inputCls}
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  {t.genderOptions.map((opt) => (
                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full h-11 bg-crocus hover:bg-crocus-hover disabled:opacity-60 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Save size={16} />
                {saving ? t.saving : t.save}
              </button>
            </div>
          </section>

          {/* ── Preferences ── */}
          <section className="p-6 rounded-2xl border border-default">
            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
              <Globe size={18} className="text-crocus" />
              {t.prefsSection}
            </h2>

            <div className="space-y-1">
              {/* Theme */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon size={16} className="text-crocus" /> : <Sun size={16} className="text-crocus" />}
                  <span className="text-sm font-medium text-primary">{t.theme}</span>
                </div>
                <div className="flex bg-surface-alt rounded-lg p-0.5">
                  {(['light', 'dark'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setTheme(m)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                        theme === m ? 'bg-surface text-primary shadow-sm' : 'text-muted'
                      )}
                    >
                      {m === 'light' ? (locale === 'zh-TW' ? '淺色' : 'Light') : (locale === 'zh-TW' ? '深色' : 'Dark')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between py-3 border-t border-default">
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-crocus" />
                  <span className="text-sm font-medium text-primary">{t.language}</span>
                </div>
                <div className="flex bg-surface-alt rounded-lg p-0.5">
                  {(['zh-TW', 'en'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocale(l)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                        locale === l ? 'bg-surface text-primary shadow-sm' : 'text-muted'
                      )}
                    >
                      {l === 'zh-TW' ? '中文' : 'EN'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Notifications ── */}
          <section className="p-6 rounded-2xl border border-default">
            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
              <Bell size={18} className="text-crocus" />
              {t.notifSection}
            </h2>

            <div className="space-y-1">
              {([
                { key: 'orderUpdates' as const, label: t.orderUpdates },
                { key: 'promotions' as const, label: t.promotions },
                { key: 'newsletter' as const, label: t.newsletter },
              ]).map(({ key, label }, i) => (
                <div key={key} className={cn('flex items-center justify-between py-3', i > 0 && 'border-t border-default')}>
                  <span className="text-sm font-medium text-primary">{label}</span>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors',
                      notifications[key] ? 'bg-crocus' : 'bg-light-gray'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                      notifications[key] ? 'left-[22px]' : 'left-0.5'
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── Security ── */}
          <section className="p-6 rounded-2xl border border-default">
            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
              <Shield size={18} className="text-crocus" />
              {t.securitySection}
            </h2>

            <div className="space-y-1">
              {[
                { label: t.changePassword },
                { label: t.twoFactor },
              ].map(({ label }, i) => (
                <button
                  key={label}
                  className={cn(
                    'w-full flex items-center justify-between py-3 text-sm font-medium text-primary hover:text-crocus transition-colors',
                    i > 0 && 'border-t border-default'
                  )}
                >
                  {label}
                  <ChevronRight size={16} className="text-muted" />
                </button>
              ))}
              <button className="w-full flex items-center justify-between py-3 text-sm font-medium text-red-500 hover:text-red-600 transition-colors border-t border-default">
                {t.deleteAccount}
                <ChevronRight size={16} />
              </button>
            </div>
          </section>

          {/* Sign out */}
          <button
            onClick={logout}
            className="w-full h-12 border border-default rounded-xl text-sm font-semibold text-secondary hover:bg-surface-alt transition-colors flex items-center justify-center gap-2"
          >
            {t.signOut}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
