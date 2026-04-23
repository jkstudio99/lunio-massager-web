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
import { useI18n } from '@/store/i18n';
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
  const { t } = useI18n();
  const { items, totalPrice, clearCart } = useCartStore();

  const stepMeta: { id: Step; label: string; description: string }[] = [
    { id: 'shipping', label: t.checkout.step1, description: t.checkout.step1Desc },
    { id: 'payment', label: t.checkout.step2, description: t.checkout.step2Desc },
    { id: 'review', label: t.checkout.step3, description: t.checkout.step3Desc },
  ];

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

    if (!form.name.trim()) nextErrors.name = t.checkout.errName;
    if (!form.phone.trim()) nextErrors.phone = t.checkout.errPhone;
    if (!form.email.trim()) nextErrors.email = t.checkout.errEmail;
    else if (!emailPattern.test(form.email.trim())) nextErrors.email = t.checkout.errEmailFormat;
    if (!form.zip.trim()) nextErrors.zip = t.checkout.errZip;
    if (!form.city.trim()) nextErrors.city = t.checkout.errCity;
    if (!form.address.trim()) nextErrors.address = t.checkout.errAddress;

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
    if (!form.cardNumber.trim()) nextErrors.cardNumber = t.checkout.errCardNumber;
    else if (!cardPattern.test(form.cardNumber.trim())) nextErrors.cardNumber = t.checkout.errCardFormat;

    if (!form.expiry.trim()) nextErrors.expiry = t.checkout.errExpiry;
    else if (!expiryPattern.test(form.expiry.trim())) nextErrors.expiry = t.checkout.errExpiryFormat;

    if (!form.cvv.trim()) nextErrors.cvv = t.checkout.errCvv;
    else if (!cvvPattern.test(form.cvv.trim())) nextErrors.cvv = t.checkout.errCvvFormat;

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
          <h2 className="mb-2 text-2xl font-bold text-primary">{t.checkout.cartEmpty}</h2>
          <p className="mb-8 text-muted">{t.checkout.cartEmptyDesc}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-crocus px-8 py-3 font-semibold text-white transition-colors hover:bg-crocus-hover"
          >
            {t.checkout.browseProducts}
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
          <h2 className="mb-3 text-3xl font-bold tracking-[-0.03em] text-primary">{t.checkout.orderSuccess}</h2>
          <p className="mb-6 text-secondary">{t.checkout.orderSuccessDesc}</p>
          <div className="mb-8 grid gap-3 rounded-2xl bg-surface-alt p-4 text-left sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{t.checkout.orderNo}</p>
              <p className="text-sm font-semibold text-primary">LUN-{Date.now().toString().slice(-8)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{t.checkout.orderStatus}</p>
              <p className="text-sm font-semibold text-primary">{t.checkout.preparing}</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-crocus"
          >
            {t.checkout.backToHome}
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
            {t.cart.title}
          </Link>
          <ChevronRight size={12} />
          <span className="text-primary">{t.checkout.breadcrumb}</span>
        </nav>

        <div className="mb-10 rounded-[28px] border border-default bg-surface-alt p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-crocus">Checkout</p>
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-primary sm:text-3xl">{t.checkout.subtitle}</h1>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-secondary shadow-sm sm:flex">
              <LockKeyhole size={14} className="text-crocus" />
              {t.checkout.secureTransaction}
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
                      <h2 className="text-xl font-bold tracking-[-0.03em] text-primary">{t.checkout.shippingInfo}</h2>
                      <p className="text-sm text-muted">{t.checkout.shippingInfoDesc}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label={t.checkout.name}
                      required
                      error={errors.name}
                      input={
                        <input
                          ref={nameRef}
                          value={form.name}
                          onChange={(e) => updateForm('name', e.target.value)}
                          className={inputClass(errors.name)}
                          placeholder={t.checkout.namePlaceholder}
                          autoComplete="name"
                        />
                      }
                    />
                    <Field
                      label={t.checkout.phone}
                      required
                      error={errors.phone}
                      input={
                        <input
                          ref={phoneRef}
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          className={inputClass(errors.phone)}
                          placeholder={t.checkout.phonePlaceholder}
                          autoComplete="tel"
                        />
                      }
                    />
                    <Field
                      label={t.checkout.email}
                      required
                      error={errors.email}
                      className="sm:col-span-2"
                      input={
                        <input
                          ref={emailRef}
                          value={form.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          className={inputClass(errors.email)}
                          placeholder={t.checkout.emailPlaceholder}
                          autoComplete="email"
                        />
                      }
                    />
                    <Field
                      label={t.checkout.zipcode}
                      required
                      error={errors.zip}
                      input={
                        <input
                          ref={zipRef}
                          value={form.zip}
                          onChange={(e) => updateForm('zip', e.target.value)}
                          className={inputClass(errors.zip)}
                          placeholder={t.checkout.zipPlaceholder}
                          inputMode="numeric"
                        />
                      }
                    />
                    <Field
                      label={t.checkout.city}
                      required
                      error={errors.city}
                      input={
                        <select
                          ref={cityRef}
                          value={form.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          className={inputClass(errors.city, true)}
                        >
                          <option value="">{t.checkout.selectCity}</option>
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
                      label={t.checkout.address}
                      required
                      error={errors.address}
                      className="sm:col-span-2"
                      input={
                        <input
                          ref={addressRef}
                          value={form.address}
                          onChange={(e) => updateForm('address', e.target.value)}
                          className={inputClass(errors.address)}
                          placeholder={t.checkout.addressPlaceholder}
                          autoComplete="street-address"
                        />
                      }
                    />
                  </div>

                  <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-primary">{t.checkout.shippingMethod}</p>
                      <p className="text-xs text-muted">{t.checkout.estimatedDelivery}</p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { id: 'standard', label: t.checkout.standardShipping, desc: `1-3 ${t.checkout.workDays}`, price: shippingFee === 0 ? t.cart.freeShipping : 'NT$ 100' },
                        { id: 'express', label: t.checkout.expressShipping, desc: t.checkout.nextDay, price: 'NT$ 160' },
                        { id: 'store', label: t.checkout.storePickup, desc: `2-3 ${t.checkout.workDays}`, price: shippingFee === 0 ? t.cart.freeShipping : 'NT$ 60' },
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
                      {t.checkout.backToCart}
                    </Link>
                    <button
                      type="button"
                      onClick={() => goToStep('payment')}
                      className="inline-flex items-center gap-2 rounded-full bg-crocus px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-crocus/20 transition-all hover:bg-crocus-hover hover:scale-[1.01]"
                    >
                      {t.checkout.nextToPayment}
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
                      <h2 className="text-xl font-bold tracking-[-0.03em] text-primary">{t.checkout.paymentMethod}</h2>
                      <p className="text-sm text-muted">{t.checkout.paymentMethodDesc}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { id: 'credit-card', label: t.checkout.creditCard, desc: t.checkout.visaMasterJcb, icon: CreditCard },
                      { id: 'line-pay', label: t.checkout.linePay, desc: t.checkout.fastPayment, icon: MessageCircle },
                      { id: 'apple-pay', label: t.checkout.applePay, desc: t.checkout.applePayDesc, icon: Apple },
                      { id: 'bank-transfer', label: t.checkout.bankTransfer, desc: t.checkout.virtualAccount, icon: Landmark },
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
                        {t.checkout.cardInfo}
                      </div>
                      <div className="grid gap-4">
                        <Field
                          label={t.checkout.cardNumber}
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
                            label={t.checkout.expiryDate}
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
                            label={t.checkout.cvv}
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
                      {t.checkout.backToShipping}
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep('review')}
                      className="inline-flex items-center gap-2 rounded-full bg-crocus px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-crocus/20 transition-all hover:bg-crocus-hover hover:scale-[1.01]"
                    >
                      {t.checkout.nextToReview}
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
                      <h2 className="text-xl font-bold tracking-[-0.03em] text-primary">{t.checkout.confirmOrder}</h2>
                      <p className="text-sm text-muted">{t.checkout.confirmOrderDesc}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SummaryCard title={t.checkout.shippingInfo} actionText={t.checkout.edit} onAction={() => setCurrentStep('shipping')}>
                      <p>{form.name || '—'} / {form.phone || '—'}</p>
                      <p>{form.email || '—'}</p>
                      <p>{form.zip} {form.city} {form.address || '—'}</p>
                      <p className="mt-2 text-xs text-muted">
                        {t.checkout.shippingMethod}：
                        {form.shippingMethod === 'standard' ? t.checkout.standardShipping : form.shippingMethod === 'express' ? t.checkout.expressShipping : t.checkout.storePickup}
                      </p>
                    </SummaryCard>

                    <SummaryCard title={t.checkout.paymentMethod} actionText={t.checkout.edit} onAction={() => setCurrentStep('payment')}>
                      <p>
                        {form.paymentMethod === 'credit-card' && t.checkout.creditCard}
                        {form.paymentMethod === 'line-pay' && t.checkout.linePay}
                        {form.paymentMethod === 'apple-pay' && t.checkout.applePay}
                        {form.paymentMethod === 'bank-transfer' && t.checkout.bankTransfer}
                      </p>
                      {form.paymentMethod === 'credit-card' && (
                        <p className="mt-2 text-xs text-muted">{t.checkout.maskedCardNotice}</p>
                      )}
                    </SummaryCard>

                    <SummaryCard title={t.cart.title} actionText={t.cart.continueShopping} onAction={() => setCurrentStep('shipping')}>
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
                      {t.checkout.backToPayment}
                    </button>
                    <button
                      ref={reviewSubmitRef}
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 rounded-full bg-crocus px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-crocus/20 transition-all hover:bg-crocus-hover hover:scale-[1.01]"
                    >
                      {t.checkout.submitOrder}
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
              <h3 className="text-lg font-bold tracking-[-0.03em] text-primary">{t.checkout.summary}</h3>
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
                <span className="text-secondary">{t.cart.subtotal}</span>
                <span className="font-medium text-primary">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">{t.cart.shipping}</span>
                <span className="font-medium text-primary">{shippingFee === 0 ? <span className="text-success">{t.cart.freeShipping}</span> : formatPrice(shippingFee)}</span>
              </div>
              {shippingFee > 0 ? (
                <p className="text-[11px] text-crocus">{t.cart.freeShippingHint.replace('{amount}', formatPrice(1500 - totalPrice()))}</p>
              ) : (
                <p className="text-[11px] text-success">{t.cart.freeShippingQualified}</p>
              )}
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-sm font-semibold text-primary">{t.cart.total}</span>
              <span className="text-2xl font-bold tracking-[-0.03em] text-primary">{formatPrice(total)}</span>
            </div>

            <div className="space-y-3 rounded-2xl bg-white p-4 text-xs text-secondary shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-crocus" />
                {t.checkout.securityAndPrivacy}
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-crocus" />
                {t.checkout.warrantyAndReturn}
              </div>
              <div className="flex items-center gap-2">
                <Package2 size={14} className="text-crocus" />
                {t.checkout.trackingNotification}
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
