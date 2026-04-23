export type ProductCategory =
  | 'calf-massager'
  | 'boot-massager'
  | 'neck-shoulder';

export type SupportedLocale = 'zh-TW' | 'en';
export type MediaFit = 'cover' | 'contain';
export type CollectionTheme = 'boot' | 'calf' | 'neck' | 'brand';

export interface LocalizedText {
  'zh-TW': string;
  en: string;
}

export interface MediaAsset {
  src: string;
  alt: LocalizedText;
  fit?: MediaFit;
  aspectRatio?: string;
  caption?: LocalizedText;
  tone?: 'light' | 'dark';
}

export interface ProductUSP {
  eyebrow?: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
}

export interface ProductMode {
  name: LocalizedText;
  description: LocalizedText;
}

export interface ProductFAQ {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ProductCTA {
  primary: LocalizedText;
  secondary: LocalizedText;
  note: LocalizedText;
}

export interface ProductTheme {
  accent: string;
  accentSoft: string;
  accentMute: string;
  contrast: string;
  surface: string;
}

export interface ProductFeatureStat {
  label: LocalizedText;
  value: string;
  description?: LocalizedText;
}

export interface ProductDetailMedia {
  controls?: MediaAsset;
  structure?: MediaAsset;
  ergonomic?: MediaAsset;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  price: number;
  comparePrice?: number;
  category: ProductCategory;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  heroImage: MediaAsset;
  heroImages: MediaAsset[];
  gallery: MediaAsset[];
  cutouts: MediaAsset[];
  usageScenes: MediaAsset[];
  usp: ProductUSP[];
  modes: ProductMode[];
  faq: ProductFAQ[];
  certifications: string[];
  theme: ProductTheme;
  cta: ProductCTA;
  stats: ProductFeatureStat[];
  detailMedia?: ProductDetailMedia;
}

export interface Category {
  id: ProductCategory;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  accent: string;
  intro: LocalizedText;
  heroMedia: MediaAsset;
  sortOrder: number;
  collectionTheme: CollectionTheme;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  role?: string;
}
