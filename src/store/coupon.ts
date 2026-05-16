import { create } from 'zustand';

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number; // percent (e.g. 15) or fixed NT$ amount
  minOrder?: number;
}

// Mock coupon database
const VALID_COUPONS: Coupon[] = [
  { code: 'WELCOME200', type: 'fixed', value: 200, minOrder: 1000 },
  { code: 'LUNIO15', type: 'percent', value: 15 },
  { code: 'SAVE500', type: 'fixed', value: 500, minOrder: 3000 },
  { code: 'VIP10', type: 'percent', value: 10 },
];

interface CouponState {
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, cartTotal: number) => { success: boolean; error?: string };
  removeCoupon: () => void;
  getDiscount: (cartTotal: number) => number;
}

export const useCouponStore = create<CouponState>()((set, get) => ({
  appliedCoupon: null,

  applyCoupon: (code, cartTotal) => {
    const coupon = VALID_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { success: false, error: 'invalid' };
    if (coupon.minOrder && cartTotal < coupon.minOrder) {
      return { success: false, error: 'minOrder' };
    }
    set({ appliedCoupon: coupon });
    return { success: true };
  },

  removeCoupon: () => set({ appliedCoupon: null }),

  getDiscount: (cartTotal) => {
    const coupon = get().appliedCoupon;
    if (!coupon) return 0;
    if (coupon.type === 'percent') return Math.round(cartTotal * (coupon.value / 100));
    return coupon.value;
  },
}));
