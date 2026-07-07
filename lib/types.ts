// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  savedProducts: string[];
  recentlyViewed: string[];
  newsletterSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  price: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  videos: string[];
  affiliateLink: string;
  couponCode?: string;
  category: Category;
  tags: string[];
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  clickCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category?: Category;
  tags: string[];
  author: User;
  readTime: number;
  isPublished: boolean;
  publishedAt?: string;
  seoTitle: string;
  seoDescription: string;
  viewCount: number;
  likeCount: number;
  comments: {
    user: User;
    content: string;
    createdAt: string;
  }[];
  relatedPosts: Blog[];
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface Analytics {
  _id: string;
  product: string;
  clicks: number;
  date: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

// Newsletter Types
export interface Newsletter {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  repliedAt?: string;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface Settings {
  _id: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  message?: string;
  data?: T;
}

// Pagination Types
export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}