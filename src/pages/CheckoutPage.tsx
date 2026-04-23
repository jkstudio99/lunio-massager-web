import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  CreditCard,
  Landmark,
  LockKeyhole,
  MessageCircle,
  Package2,
  ShieldCheck,
  Truck,
  Apple,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { cn, formatPrice } from '@/lib/utils';

type Step = 'shipping' | 'payment' | 'review';
type PaymentMethod = 'credit-card' | 'line-pay' | 'apple-pay' | 'bank-transfer';
type FieldKey =
  | 'name'
  | 'phone'
  | 'email'
  | 'zip'
  | 'city'
  | 'address'
  | 'cardNumber'
  | 'expiry'
  | 'cvv';

const stepMeta: { id: Step; label: string; description: string }[] = [
  { id: 'shipping', label: '配送資訊', description: '填寫收件資料' },
  { id: 'payment', label: '付款方式', description: '選擇安全付款' },
  { id: 'review', label: '確認訂單', description: '最後檢查後送出' },
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  zip: '',
  city: '',
  address: '',
  shippingMethod: 'standard',
  paymentMethod: 'credit-card' as PaymentMethod,
  cardNumber: '',
  expiry: '',
  cvv: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cardPattern = /^[0-9\s-]{12,23}$/;
const expiryPattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;
const cvvPattern = /^\d{3,4}$/;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);
  const reviewSubmitRef = useRef<HTMLButtonElement>(null);

  const shippingFee = totalPrice() >= 1500 ? 0 : 100;
  const total = totalPrice() + shippingFee;
  const currentStepIndex = stepMeta.findIndex((step) => step.id === currentStep);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const focusField = (field: FieldKey) => {
    const refMap: Record<FieldKey, any> = {
      name: nameRef,
      phone: phoneRef,
      email: emailRef,
      zip: zipRef,
      city: cityRef,
      address: addressRef,
      cardNumber: cardNumberRef,
      expiry: expiryRef,
      cvv: cvvRef,
    };

    requestAnimationFrame(() => {
      refMap[field].current?.focus();
    });
  };

  const firstErrorField = (fields: FieldKey[]) => fields.find((field) => errors[field]);

  const validateShipping = () => {
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    if (!form.name.trim()) nextErrors.name = '請輸入收件人姓名';
    if (!form.phone.trim()) nextErrors.phone = '請輸入聯絡電話';
    if (!form.email.trim()) nextErrors.email = '請輸入 Email';
    else if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Email 格式不正確';
    if (!form.zip.trim()) nextErrors.zip = '請輸入郵遞區號';
    if (!form.city.trim()) nextErrors.city = '請選擇縣市';
    if (!form.address.trim()) nextErrors.address = '請輸入完整地址';

    setErrors((prev) => ({ ...prev, ...nextErrors }));

    if (Object.keys(nextErrors).length > 0) {
      const first = firstErrorField(['name', 'phone', 'email', 'zip', 'city', 'address']);
      if (first) focusField(first);
      return false;
    }

    return true;
  };

  const validatePayment = () => {
    if (form.paymentMethod !== 'credit-card') {
      return true;
    }

    const nextErrors: Partial<Record<FieldKey, string>> = {};
    if (!form.cardNumber.trim()) nextErrors.cardNumber = '請輸入卡號';
    else if (!cardPattern.test(form.cardNumber.trim())) nextErrors.cardNumber = '卡號格式不正確';

    if (!form.expiry.trim()) nextErrors.expiry = '請輸入有效期限';
    else if (!expiryPattern.test(form.expiry.trim())) nextErrors.expiry = '格式需為 MM/YY';

    if (!form.cvv.trim()) nextErrors.cvv = '請輸入安全碼';
    else if (!cvvPattern.test(form.cvv.trim())) nextErrors.cvv = '安全碼需為 3 或 4 碼';

    setErrors((prev) => ({ ...prev, ...nextErrors }));

    if (Object.keys(nextErrors).length > 0) {
      const first = firstErrorField(['cardNumber', 'expiry', 'cvv']);
      if (first) focusField(first);
      return false;
    }

    return true;
  };

  const goToStep = (step: Step) => {
    if (step === 'payment' && !validateShipping()) {
      setCurrentStep('shipping');
      return;
    }

    if (step === 'review' && !validateShipping()) {
      setCurrentStep('shipping');
      return;
    }

    if (step === 'review' && !validatePayment()) {
      setCurrentStep('payment');
      return;
    }

    setCurrentStep(step);
  };

  const handleSubmit = () => {
    const shippingOk = validateShipping();
    const paymentOk = validatePayment();

    if (!shippingOk) {
      setCurrentStep('shipping');
      return;
    }

    if (!paymentOk) {
      setCurrentStep('payment');
      return;
    }

    setOrderPlaced(true);
    clearCart();
  };

  useEffect(() => {
    if (orderPlaced) return;

    if (currentStep === 'shipping') {
      focusField('name');
    }

    if (currentStep === 'payment' && form.paymentMethod === 'credit-card') {
      focusField('cardNumber');
    }

    if (currentStep === 'review') {
      requestAnimationFrame(() => reviewSubmitRef.current?.focus());
    }
  }, [currentStep, form.paymentMethod, orderPlaced]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      setCurrentStep('shipping');
    }
  }, [items.length, orderPlaced]);

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt">
            <Package2 size={32} className="text-muted" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-primary">購物車是空的</h2>
          <p className="mb-8 text-muted">先挑選喜歡的按摩器，再回來完成結帳。</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-crocus px-8 py-3 font-semibold text-white transition-colors hover:bg-crocus-hover"
          >
            瀏覽產品
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </motion.div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="w-full max-w-lg rounded-[32px] border border-default bg-surface p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.08)]"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <Check size={38} className="text-success" />
          </div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-crocus uppercase">Success</p>
          <h2 className="mb-3 text-3xl font-bold tracking-[-0.03em] text-primary">訂單已成功送出</h2>
          <p className="mb-6 text-secondary">感謝你的訂購，我們已開始為你準備出貨。</p>
          <div className="mb-8 grid gap-3 rounded-2xl bg-surface-alt p-4 text-left sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Order No.</p>
              <p className="text-sm font-semibold text-primary">LUN-{Date.now().toString().slice(-8)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Status</p>
              <p className="text-sm font-semibold text-primary">準備出貨中</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-crocus"
          >
            回到首頁
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-8 lg:py-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
          <Link to="/cart" className="transition-colors hover:text-primary">
            購物車
          </Link>
          <ChevronRight size={12} />
          <span className="text-primary">結帳</span>
        </nav>

        <div className="mb-10 rounded-[28px] border border-default bg-surface-alt p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-crocus">Checkout</p>
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-primary sm:text-3xl">流暢完成結帳</h1>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-secondary shadow-sm sm:flex">
              <LockKeyhole size={14} className="text-crocus" />
              SSL 安全交易
            </div>
          </div>

          <div className="relative grid gap-3 md:grid-cols-3">
            <div className="absolute left-6 right-6 top-7 hidden h-px bg-default md:block" />
            {stepMeta.map((step, index) => {
              const isCurrent = currentStep === step.id;
              const isCompleted = currentStepIndex > index || (currentStep === 'review' && step.id !== 'review');
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    'relative z-10 flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all',
                    isCurrent ? 'border-crocus shadow-lg shadow-crocus/10' : 'border-default hover:border-medium-gray'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                      isCompleted
                        ? 'bg-crocus text-white'
                        : isCurrent
                          ? 'bg-crocus/10 text-crocus'
                          : 'bg-surface-alt text-muted'
                    )}
                  >
                    {isCompleted ? <Check size={16} /> : index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary">{step.label}</p>
                    <p className="text-xs text-muted">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {currentStep === 'shipping' && (
                <motion.section
                  key="shipping"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  className="rounded-[28px] border border-default bg-surface p-6 shadow-sm"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-crocus/10 text-crocus">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.03em] text-primary">配送資訊</h2>
                      <p className="text-sm text-muted">先把收件資訊填好，我們就能快速送達。</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="收件人姓名"
                      required
                      error={errors.name}
                      input={
                        <input
                          ref={nameRef}
                          value={form.name}
                          onChange={(e) => updateForm('name', e.target.value)}
                          className={inputClass(errors.name)}
                          placeholder="請輸入姓名"
                          autoComplete="name"
                        />
                      }
                    />
                    <Field
                      label="聯絡電話"
                      required
                      error={errors.phone}
                      input={
                        <input
                          ref={phoneRef}
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          className={inputClass(errors.phone)}
                          placeholder="09xx-xxx-xxx"
                          autoComplete="tel"
                        />
                      }
                    />
                    <Field
                      label="Email"
                      required
                      error={errors.email}
                      className="sm:col-span-2"
                      input={
                        <input
                          ref={emailRef}
                          value={form.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          className={inputClass(errors.email)}
                          placeholder="your@email.com"
                          autoComplete="email"
                        />
                      }
                    />
                    <Field
                      label="郵遞區號"
                      required
                      error={errors.zip}
                      input={
                        <input
                          ref={zipRef}
                          value={form.zip}
                          onChange={(e) => updateForm('zip', e.target.value)}
                          className={inputClass(errors.zip)}
                          placeholder="100"
                          inputMode="numeric"
                        />
                      }
                    />
                    <Field
                      label="縣市"
                      required
                      error={errors.city}
                      input={
                        <select
                          ref={cityRef}
                          value={form.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          className={inputClass(errors.city, true)}
                        >
                          <option value="">請選擇縣市</option>
                          <option>台北市</option>
                          <option>新北市</option>
                          <option>桃園市</option>
                          <option>台中市</option>
                          <option>台南市</option>
                          <option>高雄市</option>
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
                      }
                    />
                    <Field
                      label="詳細地址"
                      required
                      error={errors.address}
                      className="sm:col-span-2"
                      input={
                        <input
                          ref={addressRef}
                          value={form.address}
                          onChange={(e) => updateForm('address', e.target.value)}
                          className={inputClass(errors.address)}
                          placeholder="請輸入完整地址"
                          autoComplete="street-address"
                        />
                      }
                    />
                  </div>

                  <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-primary">配送方式</p>
                      <p className="text-xs text-muted">預估 1–3 天送達</p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { id: 'standard', label: '標準配送', desc: '1-3 個工作天', price: shippingFee === 0 ? '免運費' : 'NT$ 100' },
                        { id: 'express', label: '快速配送', desc: '隔日到貨', price: 'NT$ 160' },
                        { id: 'store', label: '超商取貨', desc: '2-3 個工作天', price: shippingFee === 0 ? '免運費' : 'NT$ 60' },
                      ].map((method) => {
                        const active = form.shippingMethod === method.id;
                        return (
                          <label
                            key={method.id}
                            className={cn(
                              'flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all',
                              active ? 'border-crocus bg-crocus/5 shadow-sm' : 'border-default hover:border-medium-gray'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn('flex h-4 w-4 items-center justify-center rounded-full border-2', active ? 'border-crocus' : 'border-medium-gray')}>
                                {active && <div className="h-2 w-2 rounded-full bg-crocus" />}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-primary">{method.label}</p>
                                <p className="text-xs text-muted">{method.desc}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-primary">{method.price}</span>
                            <input
                              type="radio"
                              name="shipping"
                              value={method.id}
                              checked={active}
                              onChange={(e) => updateForm('shippingMethod', e.target.value)}
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary">
                      <ArrowLeft size={16} />
                      返回購物車
                    </Link>
                    <button
                      type="button"
                      onClick={() => goToStep('payment')}
                      className="inline-flex items-center gap-2 rounded-full bg-crocus px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-crocus/20 transition-all hover:bg-crocus-hover hover:scale-[1.01]"
                    >
                      下一步：付款方式
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.section>
              )}

              {currentStep === 'payment' && (
                <motion.section
                  key="payment"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  className="rounded-[28px] border border-default bg-surface p-6 shadow-sm"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-crocus/10 text-crocus">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.03em] text-primary">付款方式</h2>
                      <p className="text-sm text-muted">選一個最順手的方式，付款會更快。</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { id: 'credit-card', label: '信用卡付款', desc: '支援 VISA / Mastercard / JCB', icon: CreditCard },
                      { id: 'line-pay', label: 'LINE Pay', desc: '快速完成付款', icon: MessageCircle },
                      { id: 'apple-pay', label: 'Apple Pay', desc: 'Touch ID / Face ID 付款', icon: Apple },
                      { id: 'bank-transfer', label: 'ATM 轉帳', desc: '提供虛擬帳號，限時保留', icon: Landmark },
                    ].map((method) => {
                      const active = form.paymentMethod === method.id;
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={cn(
                            'flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all',
                            active ? 'border-crocus bg-crocus/5 shadow-sm' : 'border-default hover:border-medium-gray'
                          )}
                        >
                          <div className={cn('flex h-4 w-4 items-center justify-center rounded-full border-2', active ? 'border-crocus' : 'border-medium-gray')}>
                            {active && <div className="h-2 w-2 rounded-full bg-crocus" />}
                          </div>
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={active}
                            onChange={(e) => updateForm('paymentMethod', e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-alt text-crocus group-hover:bg-white transition-colors">
                            <Icon size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-primary">{method.label}</p>
                            <p className="text-xs text-muted">{method.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {form.paymentMethod === 'credit-card' && (
                    <div className="mt-6 rounded-2xl border border-default bg-surface-alt p-5">
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
                        <ShieldCheck size={16} className="text-crocus" />
                        卡片資訊
                      </div>
                      <div className="grid gap-4">
                        <Field
                          label="卡號"
                          required
                          error={errors.cardNumber}
                          input={
                            <input
                              ref={cardNumberRef}
                              value={form.cardNumber}
                              onChange={(e) => updateForm('cardNumber', e.target.value)}
                              className={inputClass(errors.cardNumber)}
                              placeholder="1234 5678 9012 3456"
                              inputMode="numeric"
                              autoComplete="cc-number"
                            />
                          }
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="有效期限"
                            required
                            error={errors.expiry}
                            input={
                              <input
                                ref={expiryRef}
                                value={form.expiry}
                                onChange={(e) => updateForm('expiry', e.target.value)}
                                className={inputClass(errors.expiry)}
                                placeholder="MM/YY"
                                autoComplete="cc-exp"
                              />
                            }
                          />
                          <Field
                            label="安全碼"
                            required
                            error={errors.cvv}
                            input={
                              <input
                                ref={cvvRef}
                                value={form.cvv}
                                onChange={(e) => updateForm('cvv', e.target.value)}
                                className={inputClass(errors.cvv)}
                                placeholder="CVV"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                              />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
                    >
                      <ArrowLeft size={16} />
                      返回配送資訊
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep('review')}
                      className="inline-flex items-center gap-2 rounded-full bg-crocus px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-crocus/20 transition-all hover:bg-crocus-hover hover:scale-[1.01]"
                    >
                      下一步：確認訂單
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.section>
              )}

              {currentStep === 'review' && (
                <motion.section
                  key="review"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  className="rounded-[28px] border border-default bg-surface p-6 shadow-sm"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-crocus/10 text-crocus">
                      <BadgeCheck size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.03em] text-primary">確認訂單</h2>
                      <p className="text-sm text-muted">確認內容無誤後，就可以送出訂單。</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SummaryCard title="配送資訊" actionText="修改" onAction={() => setCurrentStep('shipping')}>
                      <p>{form.name || '—'} / {form.phone || '—'}</p>
                      <p>{form.email || '—'}</p>
                      <p>{form.zip} {form.city} {form.address || '—'}</p>
                      <p className="mt-2 text-xs text-muted">配送方式：{form.shippingMethod === 'standard' ? '標準配送' : form.shippingMethod === 'express' ? '快速配送' : '超商取貨'}</p>
                    </SummaryCard>

                    <SummaryCard title="付款方式" actionText="修改" onAction={() => setCurrentStep('payment')}>
                      <p>
                        {form.paymentMethod === 'credit-card' && '信用卡付款'}
                        {form.paymentMethod === 'line-pay' && 'LINE Pay'}
                        {form.paymentMethod === 'apple-pay' && 'Apple Pay'}
                        {form.paymentMethod === 'bank-transfer' && 'ATM 轉帳'}
                      </p>
                      {form.paymentMethod === 'credit-card' && (
                        <p className="mt-2 text-xs text-muted">卡號已遮蔽，送出前會再次加密處理。</p>
                      )}
                    </SummaryCard>

                    <SummaryCard title="訂購商品" actionText="返回購物車" onAction={() => setCurrentStep('shipping')}>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.product.id} className="flex items-center gap-3">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-primary">{item.product.name}</p>
                              <p className="text-xs text-muted">x {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </SummaryCard>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('payment')}
                      className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
                    >
                      <ArrowLeft size={16} />
                      返回付款方式
                    </button>
                    <button
                      ref={reviewSubmitRef}
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 rounded-full bg-crocus px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-crocus/20 transition-all hover:bg-crocus-hover hover:scale-[1.01]"
                    >
                      確認送出訂單
                      <Check size={16} />
                    </button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit rounded-[28px] border border-default bg-surface-alt p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <LockKeyhole size={16} className="text-crocus" />
              <h3 className="text-lg font-bold tracking-[-0.03em] text-primary">訂單摘要</h3>
            </div>

            <div className="space-y-3 border-b border-default pb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-primary">{item.product.name}</p>
                    <p className="text-xs text-muted">x {item.quantity}</p>
                  </div>
                  <span className="flex-shrink-0 font-semibold text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-default py-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary">商品小計</span>
                <span className="font-medium text-primary">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">運費</span>
                <span className="font-medium text-primary">{shippingFee === 0 ? <span className="text-success">免運費</span> : formatPrice(shippingFee)}</span>
              </div>
              {shippingFee > 0 ? (
                <p className="text-[11px] text-crocus">再消費 {formatPrice(1500 - totalPrice())} 即可免運</p>
              ) : (
                <p className="text-[11px] text-success">你已達到免運門檻</p>
              )}
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-sm font-semibold text-primary">合計</span>
              <span className="text-2xl font-bold tracking-[-0.03em] text-primary">{formatPrice(total)}</span>
            </div>

            <div className="space-y-3 rounded-2xl bg-white p-4 text-xs text-secondary shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-crocus" />
                安全交易與隱私保護
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-crocus" />
                免運 / 保固 / 退換貨資訊清楚標示
              </div>
              <div className="flex items-center gap-2">
                <Package2 size={14} className="text-crocus" />
                出貨後將寄送追蹤通知
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  input,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  input: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-secondary">
        <span>{label}</span>
        {required && <span className="text-crocus">*</span>}
      </div>
      {input}
      {error && <p className="mt-1.5 text-[11px] text-alert">{error}</p>}
    </label>
  );
}

function SummaryCard({
  title,
  actionText,
  onAction,
  children,
}: {
  title: string;
  actionText: string;
  onAction: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-default bg-surface-alt p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <button type="button" onClick={onAction} className="text-xs font-medium text-crocus transition-colors hover:text-crocus-hover">
          {actionText}
        </button>
      </div>
      <div className="space-y-1 text-sm text-secondary leading-relaxed">{children}</div>
    </div>
  );
}

function inputClass(error?: string, select = false) {
  return cn(
    'w-full h-12 px-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-crocus/20 text-sm transition-colors bg-surface',
    error ? 'border-alert focus:border-alert' : 'border-default focus:border-crocus',
    select && 'appearance-none'
  );
}
