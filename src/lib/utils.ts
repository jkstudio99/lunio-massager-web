import type { LocalizedText, SupportedLocale } from '@/types/product';

export function formatPrice(price: number): string {
  return `NT$${price.toLocaleString('zh-TW')}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getDiscountPercent(price: number, comparePrice: number): number {
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function localize(text: string | LocalizedText, locale: SupportedLocale): string {
  if (typeof text === 'string') return text;
  return text[locale] ?? text['zh-TW'];
}
