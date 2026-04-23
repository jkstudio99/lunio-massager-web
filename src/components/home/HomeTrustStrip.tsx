import { Truck, Shield, RefreshCw, MessageCircle } from 'lucide-react';
import { useI18n } from '@/store/i18n';

export default function HomeTrustStrip() {
  const { t } = useI18n();

  const trustItems = [
    { icon: Truck, title: t.trust.shipping, desc: t.trust.shippingDesc },
    { icon: Shield, title: t.trust.warranty, desc: t.trust.warrantyDesc },
    { icon: RefreshCw, title: t.trust.return, desc: t.trust.returnDesc },
    { icon: MessageCircle, title: t.trust.support, desc: t.trust.supportDesc },
  ];

  return (
    <section className="py-6 bg-surface border-y border-default transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-alt border border-default">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-crocus/10 text-crocus shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-1">{title}</h3>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
