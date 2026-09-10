export type Currency = 'MAD' | 'USD' | 'EUR' | 'SAR' | 'AED';

export type Language = 'EN' | 'FR' | 'AR';

export type ThemePreset = 'botanical' | 'organic' | 'rosegold' | 'darkvelvet';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // exchange rate relative to MAD
  prefix: boolean;
}

export interface BundleOffer {
  id: string;
  title: string;
  subtitle: string;
  bottles: number;
  originalPriceMAD: number;
  priceMAD: number;
  badge?: string;
  popular?: boolean;
  freeShipping: boolean;
  gift?: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  hairType: string;
  verified: boolean;
  avatarUrl?: string;
  imageUrl?: string;
  helpfulCount: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'product' | 'usage' | 'shipping' | 'ingredients';
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  alt: string;
}

export interface CODOrder {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  bundle: BundleOffer;
  totalMAD: number;
  paymentMethod: 'cod' | 'card';
  notes?: string;
  createdAt: string;
  fullDate?: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
}

export interface ThemeConfig {
  preset: ThemePreset;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  cardBg: string;
  showCodForm: boolean;
  showStockTimer: boolean;
  showLiveSales: boolean;
  showStickyBar: boolean;
  showVideoSection?: boolean;
  videoUrl?: string;
  videoTitle?: string;
  videoSubtitle?: string;
  videoLoop?: boolean;
  videoAutoplay?: boolean;
  videoShowcaseMode?: boolean;
  freeShippingThresholdMAD: number;
  logoUrl?: string;
  logoText?: string;
  whatsappNumber?: string;
  productTitle?: string;
  productSubtitle?: string;
  productBadge?: string;
  stockAlertText?: string;
}

export interface SiteData {
  galleryImages: GalleryImage[];
  theme: ThemeConfig;
  bundles: BundleOffer[];
  reviewsList: Review[];
  orders: CODOrder[];
}
