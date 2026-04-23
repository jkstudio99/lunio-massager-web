import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Truck, RefreshCw, Shield, MessageCircle, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: '如何追蹤我的訂單？',
    a: '下單後您會收到一封確認信件，內含訂單追蹤連結。您也可以登入帳戶，在「我的訂單」中查看即時配送狀態。',
  },
  {
    q: '產品保固期限是多久？',
    a: '所有 Lunio 產品均享有一年原廠保固。保固期間若產品出現非人為因素的故障，我們將免費維修或更換。',
  },
  {
    q: '可以分期付款嗎？',
    a: '是的！我們支援信用卡 3、6、12 期零利率分期付款。結帳時選擇信用卡付款即可選擇分期方案。',
  },
  {
    q: '如何申請退換貨？',
    a: '收到商品後 7 天內，若商品未拆封或有瑕疵，請聯繫我們的客服團隊申請退換貨。我們將安排免費取件。',
  },
  {
    q: '產品是否有國際安全認證？',
    a: '所有產品均通過 CE、FCC、BSMI 等國際安全認證，並符合台灣電器安全標準。您可以放心使用。',
  },
  {
    q: '配送需要多久時間？',
    a: '台灣本島一般配送 1-3 個工作天到貨，離島地區約 3-5 個工作天。急件可選擇快速配送（加收 NT$60）。',
  },
];

const contactMethods = [
  { icon: MessageCircle, title: 'Line 客服', desc: '@lunio-tw', action: '立即諮詢' },
  { icon: Phone, title: '客服電話', desc: '02-2xxx-xxxx', action: '撥打電話' },
  { icon: Mail, title: 'Email', desc: 'support@lunio.com.tw', action: '寄送信件' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">客戶支援</h1>
            <p className="text-muted">我們隨時為您提供協助</p>
          </motion.div>
        </div>
      </section>

      {/* Quick info */}
      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: '配送資訊', desc: '全台滿 NT$1,500 免運，1-3 天到貨' },
              { icon: RefreshCw, title: '退換貨政策', desc: '7 天鑑賞期，商品未拆封可全額退款' },
              { icon: Shield, title: '保固服務', desc: '全系列產品一年原廠保固' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 border border-default rounded-xl"
              >
                <item.icon size={24} className="text-crocus mb-3" />
                <h3 className="text-base font-semibold text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-secondary/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[800px] px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">常見問題</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-default rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-primary pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'flex-shrink-0 text-muted transition-transform',
                      openFaq === i && 'rotate-180'
                    )}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-secondary leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 lg:py-16 bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">聯絡我們</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {contactMethods.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-surface rounded-xl text-center"
              >
                <m.icon size={28} className="mx-auto mb-3 text-crocus" />
                <h3 className="text-sm font-semibold text-primary mb-1">{m.title}</h3>
                <p className="text-xs text-muted mb-4">{m.desc}</p>
                <button className="text-xs font-semibold text-crocus hover:text-crocus-hover transition-colors">
                  {m.action}
                </button>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-8">
            客服時間：週一至週六 09:00 - 18:00（國定假日除外）
          </p>
        </div>
      </section>
    </div>
  );
}
