import React, { useState, useEffect } from 'react';
import { 
  Star, ShieldCheck, Truck, RotateCcw, Flame, Check, Sparkles, Clock, 
  Droplets, Leaf, Heart, Share2, Award, Maximize2, X, ChevronLeft, ChevronRight,
  ZoomIn, Scan, CheckCircle2
} from 'lucide-react';
import { BundleOffer, Currency, GalleryImage, Language, ThemeConfig } from '../types';
import { BUNDLE_OFFERS, DEFAULT_GALLERY_IMAGES, formatPrice, PRODUCT_INFO } from '../data/productData';
import { getTranslation } from '../data/translations';

interface HeroProductProps {
  currency: Currency;
  theme: ThemeConfig;
  language?: Language;
  selectedBundle: BundleOffer;
  onSelectBundle: (bundle: BundleOffer) => void;
  onScrollToOrder: () => void;
  onOpenHairQuiz: () => void;
  galleryImages?: GalleryImage[];
  bundles?: BundleOffer[];
}

export const HeroProduct: React.FC<HeroProductProps> = ({
  currency,
  theme,
  language = 'AR',
  selectedBundle,
  onSelectBundle,
  onScrollToOrder,
  onOpenHairQuiz,
  galleryImages = DEFAULT_GALLERY_IMAGES,
  bundles = BUNDLE_OFFERS,
}) => {
  const t = getTranslation(language);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 15 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Aspect ratio & fit mode (defaults to 9:16 and contain for full uncropped photos)
  const [currentAspect, setCurrentAspect] = useState<'9:16' | '4:5' | '1:1' | '16:9'>(
    theme.imageAspectRatio || '9:16'
  );
  const [currentFit, setCurrentFit] = useState<'contain' | 'cover'>(
    theme.imageFit || 'contain'
  );

  // Sync when theme props change
  useEffect(() => {
    if (theme.imageAspectRatio) setCurrentAspect(theme.imageAspectRatio);
    if (theme.imageFit) setCurrentFit(theme.imageFit);
  }, [theme.imageAspectRatio, theme.imageFit]);

  const imagesToDisplay = galleryImages && galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY_IMAGES;
  
  // Keep active index in bounds
  useEffect(() => {
    if (activeImageIndex >= imagesToDisplay.length) {
      setActiveImageIndex(0);
    }
  }, [imagesToDisplay.length, activeImageIndex]);

  const currentImage: GalleryImage = imagesToDisplay[activeImageIndex] || imagesToDisplay[0] || { id: '', url: '', alt: '', title: '' };

  const getAspectClass = () => {
    switch (currentAspect) {
      case '9:16':
        return 'aspect-[9/16] max-h-[640px] sm:max-h-[680px] w-full max-w-[440px] mx-auto';
      case '4:5':
        return 'aspect-[4/5] max-h-[620px] w-full mx-auto';
      case '16:9':
        return 'aspect-[16/9] w-full';
      case '1:1':
      default:
        return 'aspect-square max-h-[580px] w-full mx-auto';
    }
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imagesToDisplay.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imagesToDisplay.length) % imagesToDisplay.length);
  };

  // Urgency Timer Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const savingsPercent = Math.round(
    ((selectedBundle.originalPriceMAD - selectedBundle.priceMAD) / selectedBundle.originalPriceMAD) * 100
  );

  return (
    <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Large Image Box */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-xl group">
            
            {/* Top Badges Overlay */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none">
              <span className="bg-emerald-700/95 backdrop-blur-sm text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Leaf className="w-3 h-3" /> 100% طبيعي
              </span>
              <span className="bg-amber-500/95 backdrop-blur-sm text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Award className="w-3 h-3" /> الأكثر مبيعاً
              </span>
            </div>

            {/* Quick View Controls: Fit & Ratio Switcher (Top Right) */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-white/20">
              {/* Ratio Selector Buttons */}
              <button
                type="button"
                onClick={() => setCurrentAspect(currentAspect === '9:16' ? '4:5' : currentAspect === '4:5' ? '1:1' : '9:16')}
                title="تغيير أبعاد الصورة (9:16 / 4:5 / 1:1)"
                className="px-2 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-black transition flex items-center gap-1"
              >
                <Scan className="w-3 h-3 text-emerald-300" />
                <span>{currentAspect === '9:16' ? '9:16 (كاملة)' : currentAspect === '4:5' ? '4:5' : '1:1'}</span>
              </button>

              {/* Fit Toggle (Contain vs Cover) */}
              <button
                type="button"
                onClick={() => setCurrentFit(currentFit === 'contain' ? 'cover' : 'contain')}
                title="إظهار الصورة كاملة أو ملء الإطار"
                className={`px-2 py-1 rounded-xl text-[10px] font-black transition flex items-center gap-1 ${
                  currentFit === 'contain'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <span>{currentFit === 'contain' ? 'كاملة 100%' : 'ملء'}</span>
              </button>

              {/* Fullscreen Zoom */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                title="تكبير الصورة بالحجم الكامل"
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Image Frame */}
            <div 
              onClick={() => setIsFullscreen(true)}
              className={`${getAspectClass()} relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center cursor-zoom-in transition-all duration-300`}
            >
              {/* Ambient Blurred Background (Shows behind full image for premium look) */}
              {currentFit === 'contain' && currentImage.url && (
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-125 pointer-events-none transition-all duration-700"
                  style={{ backgroundImage: `url(${currentImage.url})` }}
                />
              )}

              {/* The Actual Product / Infographic Image */}
              <img
                src={currentImage.url}
                alt={currentImage.alt || currentImage.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full relative z-10 transition-all duration-300 ${
                  currentFit === 'cover'
                    ? 'object-cover group-hover:scale-105'
                    : 'object-contain p-2 sm:p-3 group-hover:scale-[1.02] drop-shadow-md'
                }`}
              />

              {/* Left/Right Navigation Arrows (Visible on hover or mobile) */}
              {imagesToDisplay.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-80 hover:opacity-100 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-80 hover:opacity-100 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom Image Counter */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full pointer-events-none">
                {activeImageIndex + 1} / {imagesToDisplay.length}
              </div>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5">
            {imagesToDisplay.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[3/4] sm:aspect-square rounded-2xl overflow-hidden border-2 transition bg-slate-50 ${
                  activeImageIndex === idx
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-95 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-1"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] py-0.5 text-center font-medium truncate px-0.5">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Fullscreen Lightbox / Zoom Modal */}
          {isFullscreen && (
            <div 
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-in fade-in"
              onClick={() => setIsFullscreen(false)}
            >
              {/* Top Bar */}
              <div className="w-full flex items-center justify-between text-white z-10 px-2 py-1" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs font-bold text-slate-300">
                  {currentImage.title || `صورة المنتج ${activeImageIndex + 1}`} ({activeImageIndex + 1}/{imagesToDisplay.length})
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Center Image */}
              <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
                <img
                  src={currentImage.url}
                  alt={currentImage.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl drop-shadow-2xl"
                />

                {imagesToDisplay.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Thumbnails in Lightbox */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full p-2 z-10" onClick={(e) => e.stopPropagation()}>
                {imagesToDisplay.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      activeImageIndex === idx ? 'border-emerald-400 scale-105' : 'border-white/30 opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain bg-black/40" />
                  </button>
                ))}
              </div>
            </div>
          )}



        </div>

        {/* Right Column: Title, Bundle Picker & Buy Action */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Title & Rating */}
          <div className="space-y-2">
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Rating stars */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900">4.9 / 5.0</span>
                <span className="text-xs text-gray-500 font-medium">(842 Verified Reviews)</span>
              </div>

              {/* Stock count */}
              {theme.showStockTimer && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{theme.stockAlertText || "Only 14 Left in Stock!"}</span>
                </div>
              )}
            </div>

            {/* Product Highlight Badge if configured */}
            {theme.productBadge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{theme.productBadge}</span>
              </div>
            )}

            {/* Main Product Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {theme.productTitle || t.productTitle}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 font-medium">
              {theme.productSubtitle || t.productSubtitle}
            </p>
          </div>

          {/* Price & Savings Display Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                {t.specialOffer} ({selectedBundle.bottles === 1 ? t.bundle1Title : selectedBundle.bottles === 2 ? t.bundle2Title : t.bundle3Title})
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-black text-emerald-900">
                  {formatPrice(selectedBundle.priceMAD, currency)}
                </span>
                <span className="text-base text-gray-400 line-through font-semibold">
                  {formatPrice(selectedBundle.originalPriceMAD, currency)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-amber-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider animate-bounce">
                {t.saveToday} {savingsPercent}%
              </span>
              {selectedBundle.freeShipping && (
                <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1 justify-end">
                  <Truck className="w-3.5 h-3.5" /> {t.freeShippingBadge}
                </div>
              )}
            </div>
          </div>



          {/* Bundle Offer Cards Selection */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t.choosePackage}</span>
            </label>

            <div className="grid grid-cols-1 gap-3">
              {bundles.map((bundle, index) => {
                const isSelected = selectedBundle.id === bundle.id;
                const bundleSavings = Math.round(
                  ((bundle.originalPriceMAD - bundle.priceMAD) / bundle.originalPriceMAD) * 100
                );

                const bTitle = index === 0 ? t.bundle1Title : index === 1 ? t.bundle2Title : t.bundle3Title;
                const bSubtitle = index === 0 ? t.bundle1Subtitle : index === 1 ? t.bundle2Subtitle : t.bundle3Subtitle;
                const bBadge = index === 1 ? t.bundle2Badge : index === 2 ? t.bundle3Badge : null;

                return (
                  <button
                    key={bundle.id}
                    onClick={() => onSelectBundle(bundle)}
                    className={`relative w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {/* Badge top right if present */}
                    {bBadge && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                        {bBadge}
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      {/* Checkbox radio circle */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                          <span>{bTitle}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{bSubtitle}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-lg text-emerald-900">
                        {formatPrice(bundle.priceMAD, currency)}
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        {formatPrice(bundle.originalPriceMAD, currency)}
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-600">
                        -{bundleSavings}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Big CTA Action Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onScrollToOrder}
              style={{ backgroundColor: theme.primaryColor }}
              className="w-full py-4 px-6 rounded-2xl text-white font-black text-base sm:text-lg shadow-xl hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 tracking-wide group"
            >
              <span>{t.buyNowPayCod}</span>
              <span className="text-emerald-200 group-hover:translate-x-1 transition-transform">➔</span>
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500 px-2 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Pay when received
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" /> Free Shipping on 2+ bottles
              </span>
              <button 
                onClick={onOpenHairQuiz} 
                className="text-emerald-700 font-bold hover:underline"
              >
                Need Hair Advice? Take Quiz
              </button>
            </div>
          </div>

          {/* Quick Features Bullet List */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-medium">
            {PRODUCT_INFO.keyBenefits.slice(0, 4).map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-2">
                <span className="text-base">{benefit.icon}</span>
                <span>{benefit.title}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
