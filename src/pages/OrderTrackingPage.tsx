import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle,
  ChevronDown, ChevronUp, MapPin, Hash, Calendar, CreditCard,
} from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { useOrderStore, type Order, type OrderStatus } from '@/store/orders';
import { formatPrice, cn } from '@/lib/utils';

const statusConfig: Record<OrderStatus, { color: string; bg: string; icon: typeof Package }> = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Clock },
  confirmed: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: CheckCircle2 },
  processing: { color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: Package },
  shipped: { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', icon: Truck },
  delivered: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle2 },
  cancelled: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: XCircle },
};

function StatusBadge({ status, locale }: { status: OrderStatus; locale: string }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  const labels: Record<OrderStatus, Record<string, string>> = {
    pending: { 'zh-TW': '待確認', en: 'Pending' },
    confirmed: { 'zh-TW': '已確認', en: 'Confirmed' },
    processing: { 'zh-TW': '處理中', en: 'Processing' },
    shipped: { 'zh-TW': '已出貨', en: 'Shipped' },
    delivered: { 'zh-TW': '已送達', en: 'Delivered' },
    cancelled: { 'zh-TW': '已取消', en: 'Cancelled' },
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold', cfg.color, cfg.bg)}>
      <Icon size={13} />
      {labels[status][locale] || labels[status].en}
    </span>
  );
}

function StatusTimeline({ status, locale }: { status: OrderStatus; locale: string }) {
  const steps: { key: OrderStatus; label: Record<string, string> }[] = [
    { key: 'pending', label: { 'zh-TW': '訂單建立', en: 'Order Placed' } },
    { key: 'confirmed', label: { 'zh-TW': '訂單確認', en: 'Confirmed' } },
    { key: 'processing', label: { 'zh-TW': '準備出貨', en: 'Processing' } },
    { key: 'shipped', label: { 'zh-TW': '已出貨', en: 'Shipped' } },
    { key: 'delivered', label: { 'zh-TW': '已送達', en: 'Delivered' } },
  ];

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 text-sm">
        <XCircle size={16} />
        {locale === 'zh-TW' ? '訂單已取消' : 'Order has been cancelled'}
      </div>
    );
  }

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentIdx = statusOrder.indexOf(status);

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            {/* connector line */}
            {i > 0 && (
              <div className={cn(
                'absolute top-3 right-1/2 w-full h-0.5',
                i <= currentIdx ? 'bg-crocus' : 'bg-light-gray'
              )} />
            )}
            {/* dot */}
            <div className={cn(
              'relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all',
              active ? 'border-crocus bg-crocus text-white scale-110' :
              done ? 'border-crocus bg-crocus text-white' :
              'border-light-gray bg-surface text-muted'
            )}>
              {done ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <span className={cn(
              'text-[10px] mt-1.5 text-center leading-tight',
              active ? 'text-crocus font-semibold' : done ? 'text-secondary' : 'text-muted'
            )}>
              {step.label[locale] || step.label.en}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, locale }: { order: Order; locale: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-default rounded-2xl overflow-hidden bg-surface"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-alt/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-crocus/10 flex items-center justify-center">
            <Package size={18} className="text-crocus" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-primary">{order.orderNumber}</p>
            <p className="text-xs text-muted mt-0.5">{order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} locale={locale} />
          {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Timeline */}
              <div className="p-4 rounded-xl bg-surface-alt">
                <StatusTimeline status={order.status} locale={locale} />
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <Link
                    key={item.productId}
                    to={`/product/${item.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-alt flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {locale === 'zh-TW' ? item.name : item.nameEn}
                      </p>
                      <p className="text-xs text-muted mt-0.5">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                  </Link>
                ))}
              </div>

              {/* Order details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-default">
                {order.trackingNumber && (
                  <div className="flex items-start gap-2">
                    <Hash size={14} className="text-crocus mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        {locale === 'zh-TW' ? '追蹤編號' : 'Tracking #'}
                      </p>
                      <p className="text-sm font-medium text-primary">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="text-crocus mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        {locale === 'zh-TW' ? '預計送達' : 'Est. Delivery'}
                      </p>
                      <p className="text-sm font-medium text-primary">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-crocus mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      {locale === 'zh-TW' ? '配送地址' : 'Shipping Address'}
                    </p>
                    <p className="text-sm font-medium text-primary">{order.shippingAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard size={14} className="text-crocus mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      {locale === 'zh-TW' ? '訂單金額' : 'Total'}
                    </p>
                    <p className="text-sm font-bold text-crocus">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OrderTrackingPage() {
  const { locale } = useI18n();
  const orders = useOrderStore((s) => s.orders);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const filterOptions: { key: 'all' | OrderStatus; label: Record<string, string> }[] = [
    { key: 'all', label: { 'zh-TW': '全部', en: 'All' } },
    { key: 'pending', label: { 'zh-TW': '待確認', en: 'Pending' } },
    { key: 'shipped', label: { 'zh-TW': '已出貨', en: 'Shipped' } },
    { key: 'delivered', label: { 'zh-TW': '已送達', en: 'Delivered' } },
    { key: 'cancelled', label: { 'zh-TW': '已取消', en: 'Cancelled' } },
  ];

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[680px] px-6 py-10 lg:py-16">
        {/* Back link */}
        <Link to="/account" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-crocus transition-colors mb-6">
          <ArrowLeft size={16} />
          {locale === 'zh-TW' ? '返回帳戶' : 'Back to Account'}
        </Link>

        <h1 className="text-2xl font-bold text-primary mb-6 tracking-[-0.02em]">
          {locale === 'zh-TW' ? '訂單追蹤' : 'Order Tracking'}
        </h1>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                filter === opt.key
                  ? 'bg-crocus text-white'
                  : 'bg-surface-alt text-secondary hover:bg-light-gray'
              )}
            >
              {opt.label[locale] || opt.label.en}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto mb-4 text-muted" />
            <p className="text-lg font-semibold text-primary mb-2">
              {locale === 'zh-TW' ? '尚無訂單' : 'No orders yet'}
            </p>
            <p className="text-sm text-muted mb-6">
              {locale === 'zh-TW' ? '開始選購喜歡的產品吧！' : 'Start shopping for products you love!'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all"
            >
              {locale === 'zh-TW' ? '探索產品' : 'Browse Products'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
