import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Truck, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Step = 'shipping' | 'payment' | 'review';

const steps: { id: Step; label: string }[] = [
  { id: 'shipping', label: '配送資訊' },
  { id: 'payment', label: '付款方式' },
  { id: 'review', label: '確認訂單' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingFee = totalPrice() >= 1500 ? 0 : 100;
  const total = totalPrice() + shippingFee;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    shippingMethod: 'standard',
    paymentMethod: 'credit-card',
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h2 className="text-2xl font-bold text-primary mb-2">購物車是空的</h2>
        <p className="text-muted mb-6">請先將商品加入購物車</p>
        <Link
          to="/products"
          className="px-8 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all"
        >
          瀏覽產品
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
        >
          <Check size={40} className="text-success" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-primary mb-2">訂單已成功送出！</h2>
          <p className="text-muted mb-2">感謝您的購買</p>
          <p className="text-sm text-secondary mb-1">
            訂單編號：<span className="font-semibold">LUN-{Date.now().toString().slice(-8)}</span>
          </p>
          <p className="text-sm text-muted mb-8">確認信件已寄至您的 Email</p>
          <Link
            to="/"
            className="px-8 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all"
          >
            回到首頁
          </Link>
        </motion.div>
      </div>
    );
  }

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-8">
          <Link to="/cart" className="hover:text-primary transition-colors">購物車</Link>
          <ChevronRight size={12} />
          <span className="text-primary">結帳</span>
        </nav>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4">
              <button
                onClick={() => i < stepIndex && setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  currentStep === step.id
                    ? 'bg-brand text-white'
                    : i < stepIndex
                    ? 'bg-success/10 text-success'
                    : 'bg-surface-alt text-muted'
                )}
              >
                {i < stepIndex ? (
                  <Check size={16} />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-surface/20 text-[11px] font-bold">
                    {i + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn('w-8 lg:w-16 h-0.5', i < stepIndex ? 'bg-success' : 'bg-light-gray')} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form area */}
          <div className="lg:col-span-2">
            {currentStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Truck size={20} className="text-crocus" />
                  配送資訊
                </h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5">收件人姓名 *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                        placeholder="請輸入姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5">聯繫電話 *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                        placeholder="09xx-xxx-xxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5">郵遞區號 *</label>
                      <input
                        type="text"
                        value={form.zip}
                        onChange={(e) => updateForm('zip', e.target.value)}
                        className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                        placeholder="100"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-secondary mb-1.5">縣市 *</label>
                      <select
                        value={form.city}
                        onChange={(e) => updateForm('city', e.target.value)}
                        className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm bg-surface"
                      >
                        <option value="">請選擇縣市</option>
                        <option>台北市</option>
                        <option>新北市</option>
                        <option>桃園市</option>
                        <option>台中市</option>
                        <option>台南市</option>
                        <option>高雄市</option>
                        <option>基隆市</option>
                        <option>新竹市</option>
                        <option>嘉義市</option>
                        <option>新竹縣</option>
                        <option>苗栗縣</option>
                        <option>彰化縣</option>
                        <option>南投縣</option>
                        <option>雲林縣</option>
                        <option>嘉義縣</option>
                        <option>屏東縣</option>
                        <option>宜蘭縣</option>
                        <option>花蓮縣</option>
                        <option>台東縣</option>
                        <option>澎湖縣</option>
                        <option>金門縣</option>
                        <option>連江縣</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1.5">詳細地址 *</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => updateForm('address', e.target.value)}
                      className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                      placeholder="請輸入完整地址"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="block text-xs font-medium text-secondary mb-3">配送方式</label>
                    <div className="space-y-2">
                      {[
                        { id: 'standard', label: '標準配送', desc: '1-3 個工作天', price: shippingFee === 0 ? '免運費' : 'NT$ 100' },
                        { id: 'express', label: '快速配送', desc: '隔日到貨', price: 'NT$ 160' },
                        { id: 'store', label: '超商取貨', desc: '2-3 個工作天', price: shippingFee === 0 ? '免運費' : 'NT$ 60' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={cn(
                            'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors',
                            form.shippingMethod === method.id
                              ? 'border-crocus bg-crocus/5'
                              : 'border-default hover:border-medium-gray'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                                form.shippingMethod === method.id ? 'border-crocus' : 'border-medium-gray'
                              )}
                            >
                              {form.shippingMethod === method.id && (
                                <div className="w-2 h-2 rounded-full bg-crocus" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-primary">{method.label}</p>
                              <p className="text-xs text-muted">{method.desc}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-primary">{method.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Link to="/cart" className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors">
                    <ArrowLeft size={16} /> 返回購物車
                  </Link>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="px-8 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all"
                  >
                    下一步：付款方式
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-crocus" />
                  付款方式
                </h2>
                <div className="space-y-3">
                  {[
                    { id: 'credit-card', label: '信用卡付款', desc: '支援 VISA / Mastercard / JCB', icon: '💳' },
                    { id: 'line-pay', label: 'LINE Pay', desc: '使用 LINE Pay 快速付款', icon: '💚' },
                    { id: 'apple-pay', label: 'Apple Pay', desc: '使用 Apple Pay 付款', icon: '🍎' },
                    { id: 'bank-transfer', label: 'ATM 轉帳', desc: '提供虛擬帳號，限 48 小時內完成轉帳', icon: '🏦' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors',
                        form.paymentMethod === method.id
                          ? 'border-crocus bg-crocus/5'
                          : 'border-default hover:border-medium-gray'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          form.paymentMethod === method.id ? 'border-crocus' : 'border-medium-gray'
                        )}
                      >
                        {form.paymentMethod === method.id && (
                          <div className="w-2 h-2 rounded-full bg-crocus" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={form.paymentMethod === method.id}
                        onChange={(e) => updateForm('paymentMethod', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-primary">{method.label}</p>
                        <p className="text-xs text-muted">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {form.paymentMethod === 'credit-card' && (
                  <div className="mt-6 p-5 border border-default rounded-xl space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5">卡號</label>
                      <input
                        type="text"
                        className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5">有效期限</label>
                        <input
                          type="text"
                          className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5">安全碼</label>
                        <input
                          type="text"
                          className="w-full h-12 px-4 border border-default rounded-2xl focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm"
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={16} /> 返回配送資訊
                  </button>
                  <button
                    onClick={() => setCurrentStep('review')}
                    className="px-8 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all"
                  >
                    下一步：確認訂單
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'review' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-crocus" />
                  確認訂單
                </h2>

                {/* Shipping summary */}
                <div className="p-5 border border-default rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-primary">配送資訊</h3>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-xs text-crocus hover:text-crocus-hover transition-colors"
                    >
                      修改
                    </button>
                  </div>
                  <div className="text-sm text-secondary space-y-1">
                    <p>{form.name || '—'} / {form.phone || '—'}</p>
                    <p>{form.email || '—'}</p>
                    <p>{form.zip} {form.city} {form.address || '—'}</p>
                  </div>
                </div>

                {/* Payment summary */}
                <div className="p-5 border border-default rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-primary">付款方式</h3>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-xs text-crocus hover:text-crocus-hover transition-colors"
                    >
                      修改
                    </button>
                  </div>
                  <p className="text-sm text-secondary">
                    {form.paymentMethod === 'credit-card' && '信用卡付款'}
                    {form.paymentMethod === 'line-pay' && 'LINE Pay'}
                    {form.paymentMethod === 'apple-pay' && 'Apple Pay'}
                    {form.paymentMethod === 'bank-transfer' && 'ATM 轉帳'}
                  </p>
                </div>

                {/* Items */}
                <div className="p-5 border border-default rounded-xl mb-6">
                  <h3 className="text-sm font-semibold text-primary mb-3">訂購商品</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted">x {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={16} /> 返回付款方式
                  </button>
                  <button
                    onClick={() => {
                      setOrderPlaced(true);
                      clearCart();
                    }}
                    className="px-10 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all hover:scale-[1.01] shadow-lg shadow-crocus/25"
                  >
                    確認送出訂單
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-surface-alt rounded-2xl">
              <h2 className="text-lg font-semibold text-primary mb-4">訂單摘要</h2>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-secondary truncate mr-2">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-default pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">商品小計</span>
                  <span className="font-medium">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">運費</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? <span className="text-success">免運費</span> : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-default">
                <span className="text-sm font-semibold text-primary">合計</span>
                <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] text-muted">
                <ShieldCheck size={14} className="text-success flex-shrink-0" />
                <span>SSL 加密安全交易，您的資料受到保護</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
