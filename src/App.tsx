import React, { useState, useEffect } from 'react';
import { BundleOffer, CODOrder, Currency, GalleryImage, Language, Review, ThemeConfig } from './types';
import { Header } from './components/Header';
import { WordPressCustomizer } from './components/WordPressCustomizer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { HeroProduct } from './components/HeroProduct';
import { OrderFormCOD } from './components/OrderFormCOD';
import { IngredientSpotlight } from './components/IngredientSpotlight';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { HowToUse } from './components/HowToUse';
import { HairQuizModal } from './components/HairQuizModal';
import { ComparisonTable } from './components/ComparisonTable';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQAccordion } from './components/FAQAccordion';
import { ProductVideo } from './components/ProductVideo';
import { StickyMobileBar } from './components/StickyMobileBar';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { BUNDLE_OFFERS, REVIEWS_DATA, DEFAULT_PRODUCT_VIDEO } from './data/productData';
import { getStoredMediaBlobUrl } from './utils/mediaStorage';
import { fetchSiteData, saveSiteData, submitOrderToServer } from './utils/apiSync';

const INITIAL_SAMPLE_ORDERS: CODOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'PB-482910',
    customerName: 'Fatima-Zahra El Amrani',
    phone: '+212 661234567',
    city: 'Casablanca',
    address: 'Avenue 2 Mars, Residence El Nakhil, Appt 4',
    bundle: BUNDLE_OFFERS[1], // Duo Pack
    totalMAD: 329,
    paymentMethod: 'cod',
    createdAt: '10:42 AM',
    fullDate: 'Jul 29, 2026',
    status: 'pending',
    notes: 'Please call 30 mins before arrival'
  },
  {
    id: 'ord-102',
    orderNumber: 'PB-910283',
    customerName: 'Othmane Bennani',
    phone: '+212 662987654',
    city: 'Rabat',
    address: 'Agdal, Rue Jebel Toubkal, Immeuble 12',
    bundle: BUNDLE_OFFERS[2], // 3 Bottles
    totalMAD: 399,
    paymentMethod: 'cod',
    createdAt: '09:15 AM',
    fullDate: 'Jul 29, 2026',
    status: 'confirmed'
  },
  {
    id: 'ord-103',
    orderNumber: 'PB-371940',
    customerName: 'Sanaa Tahiri',
    phone: '+212 663112233',
    city: 'Marrakech',
    address: 'Gueliz, Boulevard Mohamed V, N° 45',
    bundle: BUNDLE_OFFERS[0], // 1 Bottle
    totalMAD: 199,
    paymentMethod: 'cod',
    createdAt: 'Yesterday',
    fullDate: 'Jul 28, 2026',
    status: 'shipped'
  }
];

const INITIAL_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'g1',
    title: 'Product Bottle',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000',
    alt: 'Leave-In Hair Mousse Bottle Cactus Oil & Aloe Vera'
  },
  {
    id: 'g2',
    title: 'Texture & Foam',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000',
    alt: 'Lightweight foam texture dispensed in palm'
  },
  {
    id: 'g3',
    title: 'Natural Ingredients',
    url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=1000',
    alt: 'Prickly pear cactus fruit and fresh aloe vera leaves'
  },
  {
    id: 'g4',
    title: 'Hair Result',
    url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1000',
    alt: 'Hydrated glossy waves without frizz'
  }
];

export default function App() {
  const [currency, setCurrency] = useState<Currency>('MAD');
  const [language, setLanguage] = useState<Language>('EN');
  
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('phytobotanica_theme');
    const defaultTheme: ThemeConfig = {
      preset: 'botanical',
      primaryColor: '#2F3E30',
      accentColor: '#8AA48A',
      bgColor: '#FDFCFB',
      textColor: '#2D332D',
      cardBg: '#F4F1ED',
      showCodForm: true,
      showStockTimer: true,
      showLiveSales: true,
      showStickyBar: true,
      showVideoSection: true,
      videoUrl: DEFAULT_PRODUCT_VIDEO.url,
      videoTitle: DEFAULT_PRODUCT_VIDEO.title,
      videoSubtitle: DEFAULT_PRODUCT_VIDEO.subtitle,
      videoLoop: true,
      videoAutoplay: true,
      videoShowcaseMode: true,
      freeShippingThresholdMAD: 300,
      logoText: 'vola.ma',
      logoUrl: '',
      whatsappNumber: '212600000000',
    };
    return saved ? { ...defaultTheme, ...JSON.parse(saved) } : defaultTheme;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Dynamic state for bundles and gallery images
  const [bundles, setBundles] = useState<BundleOffer[]>(() => {
    const saved = localStorage.getItem('phytobotanica_bundles');
    return saved ? JSON.parse(saved) : BUNDLE_OFFERS;
  });

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem('phytobotanica_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_IMAGES;
  });

  const [orders, setOrders] = useState<CODOrder[]>(() => {
    const saved = localStorage.getItem('phytobotanica_orders');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
  });

  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    const saved = localStorage.getItem('phytobotanica_reviews');
    return saved ? JSON.parse(saved) : REVIEWS_DATA;
  });

  const [selectedBundle, setSelectedBundle] = useState<BundleOffer>(bundles[1] || BUNDLE_OFFERS[1]);
  const [isHairQuizOpen, setIsHairQuizOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CODOrder | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('phytobotanica_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('phytobotanica_bundles', JSON.stringify(bundles));
  }, [bundles]);

  useEffect(() => {
    localStorage.setItem('phytobotanica_gallery', JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    localStorage.setItem('phytobotanica_reviews', JSON.stringify(reviewsList));
  }, [reviewsList]);

  useEffect(() => {
    localStorage.setItem('phytobotanica_theme', JSON.stringify(theme));
  }, [theme]);

  // Restore persistent data from central server on startup
  useEffect(() => {
    fetchSiteData().then((serverData) => {
      if (serverData) {
        if (serverData.galleryImages && Array.isArray(serverData.galleryImages) && serverData.galleryImages.length > 0) {
          setGalleryImages(serverData.galleryImages);
        }
        if (serverData.theme) {
          setTheme((prev) => ({ ...prev, ...serverData.theme }));
        }
        if (serverData.bundles && Array.isArray(serverData.bundles) && serverData.bundles.length > 0) {
          setBundles(serverData.bundles);
        }
        if (serverData.reviewsList && Array.isArray(serverData.reviewsList) && serverData.reviewsList.length > 0) {
          setReviewsList(serverData.reviewsList);
        }
        if (serverData.orders && Array.isArray(serverData.orders) && serverData.orders.length > 0) {
          setOrders(serverData.orders);
        }
      }
    }).catch((err) => {
      console.warn('Initial server sync error:', err);
    });
  }, []);

  // Restore persistent uploaded video from IndexedDB if exists (offline fallback)
  useEffect(() => {
    getStoredMediaBlobUrl('uploaded_product_video').then((blobUrl) => {
      if (blobUrl) {
        setTheme((prev) => {
          // Only use local blob if videoUrl is currently empty or default
          if (!prev.videoUrl || prev.videoUrl.includes('mixkit')) {
            return { ...prev, videoUrl: blobUrl };
          }
          return prev;
        });
      }
    }).catch(() => {});
  }, []);

  // Update document direction based on selected language
  useEffect(() => {
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const handleUpdateGalleryImages = (images: GalleryImage[]) => {
    setGalleryImages(images);
    saveSiteData({ galleryImages: images });
  };

  const handleUpdateBundles = (newBundles: BundleOffer[]) => {
    setBundles(newBundles);
    saveSiteData({ bundles: newBundles });
  };

  const handleAddReview = (newReview: Review) => {
    setReviewsList((prev) => {
      const next = [newReview, ...prev];
      saveSiteData({ reviewsList: next });
      return next;
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviewsList((prev) => {
      const next = prev.filter((r) => r.id !== reviewId);
      saveSiteData({ reviewsList: next });
      return next;
    });
  };

  const handleUpdateTheme = (updated: Partial<ThemeConfig>) => {
    setTheme((prev) => {
      const nextTheme = { ...prev, ...updated };
      saveSiteData({ theme: nextTheme });
      return nextTheme;
    });
  };

  const handleScrollToOrderForm = () => {
    const el = document.getElementById('cod-order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOrderSuccess = (order: CODOrder) => {
    setOrders(prev => {
      const nextOrders = [order, ...prev];
      saveSiteData({ orders: nextOrders });
      return nextOrders;
    });
    submitOrderToServer(order);
    setCompletedOrder(order);
  };

  const handleUpdateOrderStatus = (orderId: string, status: CODOrder['status']) => {
    setOrders(prev => {
      const nextOrders = prev.map(o => o.id === orderId ? { ...o, status } : o);
      saveSiteData({ orders: nextOrders });
      return nextOrders;
    });
  };

  const handleUpdateOrder = (updatedOrder: CODOrder) => {
    setOrders(prev => {
      const nextOrders = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
      saveSiteData({ orders: nextOrders });
      return nextOrders;
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => {
      const nextOrders = prev.filter(o => o.id !== orderId);
      saveSiteData({ orders: nextOrders });
      return nextOrders;
    });
  };

  const handleAddSampleOrder = () => {
    const sampleNames = ['Kawtar Ziani', 'Anass El Mansouri', 'Nadia Chraibi', 'Hamza Jabri'];
    const sampleCities = ['Agadir', 'Tangier', 'Fes', 'Oujda'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];
    const randomBundle = bundles[Math.floor(Math.random() * bundles.length)] || bundles[0];

    const sample: CODOrder = {
      id: 'ord-' + Date.now(),
      orderNumber: 'PB-' + Math.floor(100000 + Math.random() * 900000),
      customerName: randomName,
      phone: '+212 6' + Math.floor(10000000 + Math.random() * 90000000),
      city: randomCity,
      address: 'Center Ville, Rue Principal N° ' + Math.floor(1 + Math.random() * 50),
      bundle: randomBundle,
      totalMAD: randomBundle.priceMAD,
      paymentMethod: 'cod',
      createdAt: 'Just now',
      fullDate: 'Jul 29, 2026',
      status: 'pending'
    };
    setOrders(prev => {
      const nextOrders = [sample, ...prev];
      saveSiteData({ orders: nextOrders });
      return nextOrders;
    });
  };

  const handleClearAllOrders = () => {
    if (window.confirm('Are you sure you want to clear all orders?')) {
      setOrders([]);
      saveSiteData({ orders: [] });
    }
  };

  return (
    <div 
      className="min-h-screen font-sans antialiased transition-colors duration-300 selection:bg-emerald-500 selection:text-white relative"
      style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
    >
      {/* Top Header with Language Selector (Arabic - French - English) */}
      <Header
        currentLang={language}
        onLangChange={setLanguage}
        theme={theme}
        onScrollToOrder={handleScrollToOrderForm}
        onOpenAdminSpace={() => setIsAdminOpen(true)}
      />

      {/* WordPress Customizer Drawer */}
      <WordPressCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        theme={theme}
        onUpdateTheme={handleUpdateTheme}
      />

      {/* Admin Dashboard Space Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
        onAddSampleOrder={handleAddSampleOrder}
        onClearAllOrders={handleClearAllOrders}
        galleryImages={galleryImages}
        onUpdateGalleryImages={handleUpdateGalleryImages}
        bundles={bundles}
        onUpdateBundles={handleUpdateBundles}
        theme={theme}
        onUpdateTheme={handleUpdateTheme}
        currency={currency}
        reviewsList={reviewsList}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
      />

      {/* Main Content Sections */}
      <main className="space-y-4">
        
        {/* 1. Hero Product Section with Gallery & Bundle Picker */}
        <HeroProduct
          language={language}
          currency={currency}
          theme={theme}
          selectedBundle={selectedBundle}
          onSelectBundle={(bundle) => {
            setSelectedBundle(bundle);
          }}
          onScrollToOrder={handleScrollToOrderForm}
          onOpenHairQuiz={() => setIsHairQuizOpen(true)}
          galleryImages={galleryImages}
          bundles={bundles}
        />

        {/* 2. Direct Cash on Delivery Order Form */}
        {theme.showCodForm && (
          <OrderFormCOD
            language={language}
            currency={currency}
            theme={theme}
            selectedBundle={selectedBundle}
            onSelectBundle={setSelectedBundle}
            onOrderSuccess={handleOrderSuccess}
            bundles={bundles}
          />
        )}

        {/* 3. Product Video Demonstration Section */}
        <ProductVideo
          language={language}
          theme={theme}
          onScrollToOrder={handleScrollToOrderForm}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 4. Ingredient Spotlight: Cactus Oil & Aloe Vera */}
        <IngredientSpotlight language={language} theme={theme} />

        {/* 4. Interactive Before & After Transformation Slider */}
        <BeforeAfterSlider language={language} />

        {/* 5. How To Use Step-by-Step Cards */}
        <HowToUse language={language} />

        {/* 6. Comparison Table: Us vs Other Mousses & Oils */}
        <ComparisonTable language={language} />

        {/* 7. Verified Customer Reviews & Photos */}
        <CustomerReviews language={language} reviews={reviewsList} onAddReview={handleAddReview} />

        {/* 8. Frequently Asked Questions */}
        <FAQAccordion language={language} />

      </main>

      {/* Floating Sticky Mobile Bar */}
      {theme.showStickyBar && (
        <StickyMobileBar
          currency={currency}
          theme={theme}
          selectedBundle={selectedBundle}
          onScrollToOrder={handleScrollToOrderForm}
        />
      )}

      {/* Hair Diagnostic Quiz Modal */}
      <HairQuizModal
        isOpen={isHairQuizOpen}
        onClose={() => setIsHairQuizOpen(false)}
        onSelectBundle={() => {
          setSelectedBundle(bundles[1] || BUNDLE_OFFERS[1]);
          handleScrollToOrderForm();
        }}
      />

      {/* Order Success Confirmation Modal */}
      <OrderSuccessModal
        order={completedOrder}
        currency={currency}
        theme={theme}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp phoneNumber={theme.whatsappNumber || '212600000000'} />

      {/* Footer */}
      <Footer 
        theme={theme} 
        onScrollToOrder={handleScrollToOrderForm} 
        onOpenAdminSpace={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
