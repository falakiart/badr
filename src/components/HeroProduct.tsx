import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Flame, Check, Sparkles, Clock, Droplets, Leaf, Heart, Share2, Award } from 'lucide-react';
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

  const imagesToDisplay = galleryImages && galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY_IMAGES;
  
  // Keep active index in bounds
  useEffect(() => {
    if (activeImageIndex >= imagesToDisplay.length) {
      setActiveImageIndex(0);
    }
  }, [imagesToDisplay.length, activeImageIndex]);

  const currentImage = imagesToDisplay[activeImageIndex] || imagesToDisplay[0] || { url: '', alt: '' };

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
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <span className="bg-emerald-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> 100% Organic Extracts
              </span>
              <span className="bg-amber-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Best Seller 2026
              </span>
            </div>

            <div className="aspect-square w-full relative overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />


            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {imagesToDisplay.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition ${
                  activeImageIndex === idx
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-95 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 text-center font-medium truncate px-1">
                  {img.title}
                </span>
              </button>
            ))}
          </div>



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
