import { motion } from 'framer-motion';
import { FileText, ShoppingCart, Truck, RefreshCw, AlertTriangle, Scale } from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5 },
};

export default function TermsPage() {
  const { locale } = useI18n();
  const isZh = locale === 'zh-TW';

  const lastUpdated = isZh ? '2025 年 1 月 15 日' : 'January 15, 2025';

  const sections = [
    {
      icon: <FileText size={20} />,
      title: isZh ? '服務條款總覽' : 'Terms Overview',
      content: isZh
        ? [
            '歡迎使用 Lunio 網站和服務。使用本網站即表示您同意遵守以下條款和條件。',
            '• 本條款適用於 Lunio 官方網站 (lunio.com.tw) 的所有使用者',
            '• 我們保留隨時修改這些條款的權利',
            '• 修改後繼續使用本服務表示您接受更新的條款',
            '• 如您不同意任何條款，請停止使用本網站',
          ]
        : [
            'Welcome to the Lunio website and services. By using this website, you agree to comply with the following terms and conditions.',
            '• These terms apply to all users of the official Lunio website (lunio.com.tw)',
            '• We reserve the right to modify these terms at any time',
            '• Continued use after modifications indicates acceptance of updated terms',
            '• If you disagree with any terms, please discontinue use of this website',
          ],
    },
    {
      icon: <ShoppingCart size={20} />,
      title: isZh ? '購買與付款' : 'Purchases & Payments',
      content: isZh
        ? [
            '關於在 Lunio 網站上進行的購買和付款：',
            '• 所有價格均以新台幣 (NTD) 標示，含稅',
            '• 下單後我們將發送訂單確認郵件',
            '• 我們接受信用卡、行動支付和銀行轉帳',
            '• 價格可能因促銷活動而有所變動',
            '• 我們保留在庫存不足時取消訂單的權利',
            '• 訂單確認後如需取消，請在出貨前聯繫客服',
          ]
        : [
            'Regarding purchases and payments on the Lunio website:',
            '• All prices are displayed in NTD (New Taiwan Dollar), tax-inclusive',
            '• You will receive an order confirmation email after placing an order',
            '• We accept credit cards, mobile payments, and bank transfers',
            '• Prices may change due to promotional activities',
            '• We reserve the right to cancel orders due to insufficient inventory',
            '• For cancellations after order confirmation, please contact customer service before shipping',
          ],
    },
    {
      icon: <Truck size={20} />,
      title: isZh ? '配送服務' : 'Shipping & Delivery',
      content: isZh
        ? [
            '我們致力於快速且安全地將產品送達您手中：',
            '• 台灣本島：標準配送 2-3 個工作天',
            '• 離島地區：標準配送 5-7 個工作天',
            '• 免運費門檻：訂單滿 NT$2,000 免運費',
            '• 訂單出貨後將提供物流追蹤編號',
            '• 配送時間可能因節假日或天災而延遲',
            '• 收到包裹時請當面檢查，如有損壞請立即通知',
          ]
        : [
            'We are committed to delivering products quickly and safely:',
            '• Taiwan mainland: Standard delivery 2-3 business days',
            '• Offshore islands: Standard delivery 5-7 business days',
            '• Free shipping threshold: Orders over NT$2,000',
            '• Tracking numbers provided after shipment',
            '• Delivery times may be delayed due to holidays or natural disasters',
            '• Please inspect packages upon delivery and notify us immediately of any damage',
          ],
    },
    {
      icon: <RefreshCw size={20} />,
      title: isZh ? '退換貨政策' : 'Returns & Exchanges',
      content: isZh
        ? [
            '我們希望您對購買完全滿意：',
            '• 收到商品後 7 天內可申請退換貨（依消費者保護法）',
            '• 退換貨商品須保持全新未使用狀態，含完整包裝',
            '• 退換貨運費：商品瑕疵由我們負擔，其他由消費者負擔',
            '• 退款將在收到退回商品後 7-14 個工作天內處理',
            '• 特價商品和客製化商品不適用退換貨',
            '• 申請退換貨請聯繫客服取得 RMA 編號',
          ]
        : [
            'We want you to be completely satisfied with your purchase:',
            '• Returns and exchanges can be requested within 7 days of receiving the product',
            '• Returned items must be in new, unused condition with complete packaging',
            '• Shipping costs: We cover defective items; customer covers other returns',
            '• Refunds processed within 7-14 business days after receiving returned items',
            '• Sale items and customized products are not eligible for returns',
            '• Contact customer service for an RMA number before returning',
          ],
    },
    {
      icon: <AlertTriangle size={20} />,
      title: isZh ? '使用限制' : 'Usage Restrictions',
      content: isZh
        ? [
            '使用本網站時，您同意不會：',
            '• 以任何方式干擾或破壞網站的正常運作',
            '• 試圖未經授權存取我們的系統或資料',
            '• 使用自動化工具大量擷取網站內容',
            '• 散佈惡意軟體或進行網路攻擊',
            '• 假冒他人身份或提供虛假資訊',
            '• 將本網站用於任何非法或未經授權的目的',
            '違反以上規定可能導致帳號停用或法律追訴。',
          ]
        : [
            'When using this website, you agree not to:',
            '• Interfere with or disrupt the normal operation of the website',
            '• Attempt unauthorized access to our systems or data',
            '• Use automated tools to scrape website content in bulk',
            '• Distribute malware or conduct cyber attacks',
            '• Impersonate others or provide false information',
            '• Use this website for any illegal or unauthorized purposes',
            'Violation of these restrictions may result in account suspension or legal action.',
          ],
    },
    {
      icon: <Scale size={20} />,
      title: isZh ? '免責聲明與法律管轄' : 'Disclaimers & Jurisdiction',
      content: isZh
        ? [
            '• 本網站內容僅供參考，不構成任何保證或承諾',
            '• 產品圖片可能因螢幕顯示差異而與實物有所出入',
            '• 我們不對因使用本網站而產生的任何間接損失負責',
            '• 本條款受中華民國法律管轄',
            '• 如有爭議，雙方同意以台北地方法院為第一審管轄法院',
            '• 本條款的任何部分若被認定為無效，不影響其餘部分的效力',
          ]
        : [
            '• Website content is for reference only and does not constitute any guarantee',
            '• Product images may differ from actual items due to screen variations',
            '• We are not liable for any indirect damages arising from website use',
            '• These terms are governed by the laws of the Republic of China (Taiwan)',
            '• Both parties agree to Taipei District Court as the court of first instance',
            '• If any part of these terms is deemed invalid, the remaining parts remain in effect',
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
                <FileText size={20} className="text-crocus" />
              </div>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus">
                Terms of Service
              </p>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-[-0.02em]">
              {isZh ? '服務條款' : 'Terms of Service'}
            </h1>
            <p className="text-muted mt-3 max-w-lg text-sm">
              {isZh
                ? '請仔細閱讀以下服務條款。使用 Lunio 網站和服務即表示您同意這些條款。'
                : 'Please read the following terms carefully. By using the Lunio website and services, you agree to these terms.'}
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
              to="/privacy"
              className="text-sm font-medium text-crocus hover:text-crocus-hover transition-colors"
            >
              {isZh ? '隱私政策' : 'Privacy Policy'}
            </Link>
            <span className="text-muted">•</span>
            <Link
              to="/support"
              className="text-sm font-medium text-crocus hover:text-crocus-hover transition-colors"
            >
              {isZh ? '常見問題' : 'FAQ'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
