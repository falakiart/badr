import { BundleOffer, Currency, CurrencyConfig, FAQItem, Review } from '../types';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  MAD: { code: 'MAD', symbol: 'DH', rate: 1, prefix: false },
  USD: { code: 'USD', symbol: '$', rate: 0.1, prefix: true },
  EUR: { code: 'EUR', symbol: '€', rate: 0.092, prefix: true },
  SAR: { code: 'SAR', symbol: 'SR', rate: 0.375, prefix: false },
  AED: { code: 'AED', symbol: 'AED', rate: 0.367, prefix: false },
};

export function formatPrice(amountMAD: number, currency: Currency): string {
  const config = CURRENCIES[currency] || CURRENCIES.MAD;
  const converted = Math.round(amountMAD * config.rate * 100) / 100;
  if (config.prefix) {
    return `${config.symbol}${converted.toFixed(2)}`;
  }
  return `${converted.toFixed(0)} ${config.symbol}`;
}

export const PRODUCT_INFO = {
  title: "Leave-In Hair Mousse – Cactus Oil & Aloe Vera",
  subtitle: "Nourishing, Lightweight No-Rinse Foam for Frizz-Free, Radiant Hair",
  size: "150ml (5 fl oz)",
  rating: 4.9,
  reviewCount: 842,
  inStockCount: 14,
  claimedPercentage: 86,
  
  details: {
    productName: "Leave-In Hair Mousse",
    keyIngredients: "Prickly Pear Cactus Oil & Pure Aloe Vera Gel",
    hairType: "All Hair Types (Curly, Wavy, Straight, Coily, Color-Treated)",
    size: "150ml (5 fl oz)",
    texture: "Ultra-Lightweight Micro-Foam",
    use: "Daily Leave-In Hydrating & Anti-Frizz Hair Care",
  },

  description: "Give your hair the daily care it deserves with our Leave-In Hair Mousse, enriched with the nourishing power of Cactus Oil and Aloe Vera. This lightweight, no-rinse formula deeply hydrates, helps reduce frizz, and leaves hair feeling soft, smooth, and naturally radiant without weighing it down. Leave-in mousses are commonly used to add hydration, improve manageability, tame frizz, and provide light styling support while remaining lightweight.",

  longDescription: "Perfect for all hair types, this mousse helps detangle strands, enhances natural texture, and provides long-lasting moisture while protecting hair from dryness and everyday environmental stress.",

  keyBenefits: [
    {
      id: 'b1',
      icon: '💧',
      title: 'Deeply Hydrates & Nourishes',
      description: 'Penetrates deep into hair cuticles to restore moisture balance from root to tip.'
    },
    {
      id: 'b2',
      icon: '🌵',
      title: 'Enriched with Cactus Oil & Aloe Vera',
      description: 'Packed with Vitamin E, essential fatty acids, and soothing botanical antioxidants.'
    },
    {
      id: 'b3',
      icon: '✨',
      title: 'Controls Frizz & Flyaways',
      description: 'Tames stubborn baby hairs and humidity-induced frizz instantly for up to 48 hours.'
    },
    {
      id: 'b4',
      icon: '🌿',
      title: 'Softens Without Build-Up',
      description: 'Leaves zero crunchy or sticky residue—just natural, touchably soft hair texture.'
    },
    {
      id: 'b5',
      icon: '💨',
      title: 'Lightweight & Non-Greasy',
      description: 'Air-whipped foam technology that lifts hair naturally without weighing down volume.'
    },
    {
      id: 'b6',
      icon: '💆',
      title: 'No Rinse Required',
      description: 'Quick & seamless daily routine: apply and go! Works on damp or dry hair.'
    },
    {
      id: 'b7',
      icon: '🌟',
      title: 'Suitable for All Hair Types',
      description: 'Formulated safely for fine, thick, coily, bleached, or heat-styled hair.'
    }
  ],

  howToUseSteps: [
    {
      step: 1,
      title: "Shake Well",
      description: "Shake the bottle well before use to activate the organic Cactus Oil & Aloe Vera blend.",
      icon: "Bottle"
    },
    {
      step: 2,
      title: "Dispense 2–4 Pumps",
      description: "Dispense 2–4 pumps of lightweight micro-foam directly into your palm.",
      icon: "Sparkles"
    },
    {
      step: 3,
      title: "Apply Evenly",
      description: "Apply evenly through damp or dry hair, focusing on mid-lengths and split ends.",
      icon: "Hand"
    },
    {
      step: 4,
      title: "Style & Leave In",
      description: "Style as desired with hands or comb. Do not rinse out! Enjoy all-day softness.",
      icon: "CheckCircle2"
    }
  ],

  ingredientHighlights: [
    {
      name: "Organic Prickly Pear Cactus Oil",
      role: "Moisture Lock & Heat Protection",
      description: "Renowned as Morocco's miracle elixir, Cactus Oil contains 150% more Vitamin E than Argan oil. It repairs cuticles, locks in moisture, and guards against heat and environmental stress.",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Pure Aloe Vera Barbadensis Gel",
      role: "Deep Hydration & Frizz Taming",
      description: "Packed with 75 active nutrients, vitamins A, C, E, and amino acids. Aloe Vera hydrates thirsty hair strands, soothes the scalp, and smooths split ends without heaviness.",
      image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Micro-Foam Conditioning Complex",
      role: "Non-Greasy Airy Volume",
      description: "Specially formulated botanical foam structure that melts instantly upon touch, sealing hair cuticles while keeping hair light, bouncy, and touchable.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
    }
  ]
};

export const BUNDLE_OFFERS: BundleOffer[] = [
  {
    id: 'bundle-1',
    title: '1 Bottle (Try & Test)',
    subtitle: 'Standard 150ml Pack',
    bottles: 1,
    originalPriceMAD: 299,
    priceMAD: 199,
    freeShipping: false,
    gift: 'Includes Free Beauty E-Guide'
  },
  {
    id: 'bundle-2',
    title: '2 Bottles (Duo Pack)',
    subtitle: 'Most Popular Choice',
    bottles: 2,
    originalPriceMAD: 598,
    priceMAD: 329,
    badge: '🔥 BEST SELLER - SAVE 45%',
    popular: true,
    freeShipping: true,
    gift: 'FREE Express Delivery + Hair Scalp Brush'
  },
  {
    id: 'bundle-3',
    title: '3 Bottles (BUY 2 GET 1 FREE)',
    subtitle: 'Ultimate Hair Care Value',
    bottles: 3,
    originalPriceMAD: 897,
    priceMAD: 399,
    badge: '🎁 BUY 2 GET 1 FREE (SAVE 55%)',
    popular: false,
    freeShipping: true,
    gift: 'FREE Express Shipping + Satin Hair Scrunchie Set'
  }
];

export const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Agadir", "Tangier", "Fes", "Meknes", "Oujda", 
  "Kenitra", "Tetouan", "Safi", "Temara", "Sale", "Mohammedia", "El Jadida", "Nador", 
  "Beni Mellal", "Khouribga", "Taza", "Laayoune", "Dakhla", "Ksar El Kebir"
];

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    author: 'Sanaa M.',
    city: 'Casablanca',
    rating: 5,
    date: '2 days ago',
    comment: 'Waw wallahila top! Hair becomes super soft without feeling oily or heavy. My curls look bouncy and defined all day long. Delivery in Casablanca was under 24 hours!',
    hairType: 'Curly 3B Hair',
    verified: true,
    helpfulCount: 34,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rev-2',
    author: 'Houda B.',
    city: 'Rabat',
    rating: 5,
    date: '4 days ago',
    comment: 'The combination of Cactus Oil & Aloe Vera is brilliant. I used to suffer from extreme humidity frizz in Rabat, but 3 pumps of this mousse completely fixed it. Will definitely reorder the 3 bottle bundle!',
    hairType: 'Wavy & Frizzy Hair',
    verified: true,
    helpfulCount: 28,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rev-3',
    author: 'Yasmine K.',
    city: 'Marrakech',
    rating: 5,
    date: '1 week ago',
    comment: 'Zero crunchy feeling! I hate old traditional mousses that make hair hard like wire. This one is like a hydrating cloud. Smell is so refreshing and natural.',
    hairType: 'Fine & Dry Hair',
    verified: true,
    helpfulCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rev-4',
    author: 'Khadija T.',
    city: 'Agadir',
    rating: 5,
    date: '1 week ago',
    comment: 'Super fast Cash on Delivery in Agadir. Packaging is high quality and the foam dispenser pumps smoothly. Hair feels silky immediately.',
    hairType: 'Bleached & Damaged',
    verified: true,
    helpfulCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rev-5',
    author: 'Meriem L.',
    city: 'Tangier',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Very good product for daily use. I use 2 pumps every morning after shower. Keeps flyaways tame all day. Highly recommended!',
    hairType: 'Coily 4A Hair',
    verified: true,
    helpfulCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=600'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'usage',
    question: 'Will this Leave-In Mousse leave my hair feeling sticky or crunchy?',
    answer: 'Not at all! Unlike old-fashioned styling mousses, our formula is a lightweight hydrating treatment. It absorbs directly into hair strands to nourish with Aloe Vera and Cactus Oil, leaving your hair soft, smooth, and touchable with zero residue or crunch.'
  },
  {
    id: 'faq-2',
    category: 'usage',
    question: 'Can I apply it on dry hair or only wet hair?',
    answer: 'You can use it on both! On damp post-shower hair, it acts as a deep hydration seal and detangler. On dry hair, it serves as a daily refresh to tame morning frizz, smooth flyaways, and restore shine.'
  },
  {
    id: 'faq-3',
    category: 'ingredients',
    question: 'Is it suitable for color-treated or chemically straightened hair?',
    answer: 'Yes! It is 100% sulfate-free, paraben-free, and safe for dyed, bleached, keratin-treated, or protein-treated hair. Cactus Oil helps repair cuticles weakened by chemical processing.'
  },
  {
    id: 'faq-4',
    category: 'shipping',
    question: 'How long does delivery take and how do I pay?',
    answer: 'We offer Cash on Delivery (Paiement à la livraison) across all cities in Morocco! Delivery takes 24 to 48 hours. You pay only when you receive your package and inspect your order.'
  },
  {
    id: 'faq-5',
    category: 'product',
    question: 'How long will one 150ml bottle last?',
    answer: 'With daily use of 2 to 3 pumps, one 150ml bottle typically lasts between 30 to 45 days depending on your hair length and density.'
  }
];

export const RECENT_SALES = [
  { name: 'Fatima-Zahra', city: 'Casablanca', bundle: '2 Bottles (Duo Pack)', timeAgo: '2 minutes ago' },
  { name: 'Meryem', city: 'Rabat', bundle: '3 Bottles (BUY 2 GET 1 FREE)', timeAgo: '5 minutes ago' },
  { name: 'Siham', city: 'Marrakech', bundle: '2 Bottles (Duo Pack)', timeAgo: '8 minutes ago' },
  { name: 'Kawtar', city: 'Tangier', bundle: '1 Bottle (150ml)', timeAgo: '12 minutes ago' },
  { name: 'Zineb', city: 'Agadir', bundle: '3 Bottles (BUY 2 GET 1 FREE)', timeAgo: '15 minutes ago' },
];
