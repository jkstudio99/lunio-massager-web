import type { LocalizedText } from './product';

export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  category: LocalizedText;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: LocalizedText;
  };
  publishedAt: string;
  readTime: number;
  tags: LocalizedText[];
  featured?: boolean;
  relatedProductSlug?: string;
}

export interface BlogCategory {
  id: string;
  name: LocalizedText;
  slug: string;
}
