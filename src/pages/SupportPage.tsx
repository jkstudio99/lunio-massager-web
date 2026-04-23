import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Truck, RefreshCw, Shield, MessageCircle, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useI18n } from '@/store/i18n';

export default function SupportPage() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactMethods = [
    { icon: MessageCircle, title: t.support.contact.line, desc: '@lunio-tw', action: t.support.contact.actionConsult },
    { icon: Phone, title: t.support.contact.phone, desc: '02-2xxx-xxxx', action: t.support.contact.actionCall },
    { icon: Mail, title: t.support.contact.email, desc: 'support@lunio.com.tw', action: t.support.contact.actionSend },
  ];

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">{t.support.title}</h1>
            <p className="text-muted">{t.support.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Quick info */}
      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: t.trust.shipping, desc: t.trust.shippingDesc },
              { icon: RefreshCw, title: t.footer.returnPolicy, desc: t.trust.returnDesc },
              { icon: Shield, title: t.footer.warrantyService, desc: t.trust.warrantyDesc },
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
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">{t.support.faqTitle}</h2>
          <div className="space-y-3">
            {t.support.faqs.map((faq, i) => (
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
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">{t.support.contactTitle}</h2>
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
            {t.support.serviceHours}
          </p>
        </div>
      </section>
    </div>
  );
}

