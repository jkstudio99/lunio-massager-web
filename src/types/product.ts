export interface Product {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  shortDescription: string;
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
}

export type ProductCategory =
  | 'calf-massager'
  | 'boot-massager'
  | 'neck-shoulder';

export interface Category {
  id: ProductCategory;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
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
}
