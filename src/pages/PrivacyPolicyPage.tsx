import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { useCookieStore } from '@/store/cookie';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5 },
};

export default function PrivacyPolicyPage() {
  const { locale } = useI18n();
  const isZh = locale === 'zh-TW';

  const lastUpdated = isZh ? '2025 年 1 月 15 日' : 'January 15, 2025';

  const sections = [
    {
      icon: <Database size={20} />,
      title: isZh ? '我們收集的資訊' : 'Information We Collect',
      content: isZh
        ? [
            '當您使用 Lunio 網站或購買我們的產品時，我們可能會收集以下資訊：',
            '• 個人識別資訊：姓名、電子郵件地址、電話號碼、寄送地址',
            '• 帳戶資訊：使用者名稱、密碼（加密儲存）、偏好設定',
            '• 交易資訊：購買記錄、付款方式（不儲存完整信用卡號）',
            '• 裝置資訊：IP 位址、瀏覽器類型、作業系統、裝置識別碼',
            '• 使用資訊：瀏覽頁面、點擊行為、停留時間、來源網站',
          ]
        : [
            'When you use the Lunio website or purchase our products, we may collect the following information:',
            '• Personal identification: Name, email address, phone number, shipping address',
            '• Account information: Username, password (encrypted), preferences',
            '• Transaction data: Purchase history, payment methods (full card numbers are not stored)',
            '• Device information: IP address, browser type, operating system, device identifiers',
            '• Usage data: Pages visited, click behavior, time spent, referral sources',
          ],
    },
    {
      icon: <Eye size={20} />,
      title: isZh ? '我們如何使用您的資訊' : 'How We Use Your Information',
      content: isZh
        ? [
            '我們使用收集的資訊用於以下目的：',
            '• 處理和履行您的訂單',
            '• 提供客戶支援和回應諮詢',
            '• 改善我們的產品和服務',
            '• 發送行銷通訊（您可隨時取消訂閱）',
            '• 個人化您的購物體驗',
            '• 防止詐騙和維護安全',
            '• 遵守法律義務',
          ]
        : [
            'We use the collected information for the following purposes:',
            '• Process and fulfill your orders',
            '• Provide customer support and respond to inquiries',
            '• Improve our products and services',
            '• Send marketing communications (you can unsubscribe at any time)',
            '• Personalize your shopping experience',
            '• Prevent fraud and maintain security',
            '• Comply with legal obligations',
          ],
    },
    {
      icon: <Lock size={20} />,
      title: isZh ? '資料安全' : 'Data Security',
      content: isZh
        ? [
            '我們採取適當的技術和組織措施來保護您的個人資料：',
            '• SSL/TLS 加密傳輸所有敏感資料',
            '• 定期安全審計和漏洞掃描',
            '• 嚴格的員工資料存取控制',
            '• 資料加密儲存',
            '• 定期備份和災難復原計畫',
            '然而，任何網路傳輸都不能保證 100% 安全。如發現資料洩露，我們將在 72 小時內通知受影響的用戶。',
          ]
        : [
            'We implement appropriate technical and organizational measures to protect your personal data:',
            '• SSL/TLS encryption for all sensitive data transmission',
            '• Regular security audits and vulnerability scanning',
            '• Strict employee data access controls',
            '• Encrypted data storage',
            '• Regular backups and disaster recovery plans',
            'However, no internet transmission can guarantee 100% security. In case of a data breach, we will notify affected users within 72 hours.',
          ],
    },
    {
      icon: <Globe size={20} />,
      title: isZh ? 'Cookie 和追蹤技術' : 'Cookies and Tracking Technologies',
      content: isZh
        ? [
            '我們使用 Cookie 和類似技術來改善您的體驗：',
            '• 必要 Cookie：網站正常運作所需（無法關閉）',
            '• 分析 Cookie：幫助我們了解網站使用情況',
            '• 行銷 Cookie：用於提供相關廣告',
            '• 個人化 Cookie：記住您的偏好設定',
            '您可以隨時透過我們的 Cookie 設定面板管理您的偏好。詳情請參閱我們的 Cookie 政策。',
          ]
        : [
            'We use cookies and similar technologies to improve your experience:',
            '• Necessary cookies: Required for the website to function (cannot be disabled)',
            '• Analytics cookies: Help us understand website usage',
            '• Marketing cookies: Used to deliver relevant advertisements',
            '• Personalization cookies: Remember your preferences',
            'You can manage your preferences at any time through our Cookie Settings panel. See our Cookie Policy for details.',
          ],
    },
    {
      icon: <Shield size={20} />,
      title: isZh ? '您的權利' : 'Your Rights',
      content: isZh
        ? [
            '根據適用的資料保護法律，您享有以下權利：',
            '• 存取權：要求存取我們持有的您的個人資料',
            '• 更正權：要求更正不正確的個人資料',
            '• 刪除權：要求刪除您的個人資料',
            '• 限制處理權：要求限制我們處理您的資料',
            '• 資料攜帶權：以結構化格式接收您的資料',
            '• 反對權：反對我們處理您的資料',
            '如欲行使這些權利，請透過下方聯絡方式與我們聯繫。',
          ]
        : [
            'Under applicable data protection laws, you have the following rights:',
            '• Right of access: Request access to your personal data we hold',
            '• Right to rectification: Request correction of inaccurate personal data',
            '• Right to erasure: Request deletion of your personal data',
            '• Right to restrict processing: Request limitation of data processing',
            '• Right to data portability: Receive your data in a structured format',
            '• Right to object: Object to our processing of your data',
            'To exercise these rights, please contact us using the methods below.',
          ],
    },
    {
      icon: <Mail size={20} />,
      title: isZh ? '聯絡我們' : 'Contact Us',
      content: isZh
        ? [
            '如有任何隱私相關問題或要行使您的權利，請與我們聯繫：',
            '• 電子郵件：privacy@lunio.com.tw',
            '• 電話：(02) 2771-8899',
            '• 地址：台北市信義區松仁路 100 號 12 樓',
            '我們將在收到您的請求後 30 天內回覆。',
          ]
        : [
            'For any privacy-related questions or to exercise your rights, please contact us:',
            '• Email: privacy@lunio.com.tw',
            '• Phone: +886 2-2771-8899',
            '• Address: 12F, No. 100, Songren Rd., Xinyi Dist., Taipei City',
            'We will respond to your request within 30 days.',
          ],
    },
  ];

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="bg-surface-alt border-b border-default">
        <div className="mx-auto max-w-[900px] px-6 lg:px-8 py-12 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-crocus/10 flex items-center justify-center">
                <Shield size={20} className="text-crocus" />
              </div>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus">
                Privacy Policy
              </p>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-[-0.02em]">
              {isZh ? '隱私政策' : 'Privacy Policy'}
            </h1>
            <p className="text-muted mt-3 max-w-lg text-sm">
              {isZh
                ? '我們致力於保護您的個人隱私。本政策說明我們如何收集、使用和保護您的資訊。'
                : 'We are committed to protecting your privacy. This policy explains how we collect, use, and protect your information.'}
            </p>
            <p className="text-xs text-muted mt-4">
              {isZh ? '最後更新：' : 'Last updated: '}{lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[900px] px-6 lg:px-8 py-10 lg:py-16">
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-surface rounded-2xl border border-default p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-crocus/10 flex items-center justify-center text-crocus">
                  {section.icon}
                </div>
                <h2 className="text-lg font-semibold text-primary">{section.title}</h2>
              </div>
              <div className="space-y-2 pl-12">
                {section.content.map((line, j) => (
                  <p
                    key={j}
                    className={`text-sm leading-relaxed ${
                      line.startsWith('•') ? 'text-secondary pl-2' : 'text-muted'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom links */}
        <motion.div {...fadeInUp} className="mt-12 text-center">
          <p className="text-sm text-muted mb-4">
            {isZh ? '相關連結' : 'Related Links'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/terms"
              className="text-sm font-medium text-crocus hover:text-crocus-hover transition-colors"
            >
              {isZh ? '服務條款' : 'Terms of Service'}
            </Link>
            <span className="text-muted">•</span>
            <button
              onClick={() => useCookieStore.getState().openSettings()}
              className="text-sm font-medium text-crocus hover:text-crocus-hover transition-colors"
            >
              {isZh ? 'Cookie 設定' : 'Cookie Settings'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
