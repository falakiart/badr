import React from 'react';
import { ShoppingBag, Truck } from 'lucide-react';
import { BundleOffer, Currency, ThemeConfig } from '../types';
import { formatPrice } from '../data/productData';

interface StickyMobileBarProps {
  currency: Currency;
  theme: ThemeConfig;
  selectedBundle: BundleOffer;
  onScrollToOrder: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  currency,
  theme,
  selectedBundle,
  onScrollToOrder,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-2xl flex items-center justify-between gap-3">
      
      <div>
        <div className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[140px]">
          {selectedBundle.title}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-emerald-900">
            {formatPrice(selectedBundle.priceMAD, currency)}
          </span>
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(selectedBundle.originalPriceMAD, currency)}
          </span>
        </div>
      </div>

      <button
        onClick={onScrollToOrder}
        style={{ backgroundColor: theme.primaryColor }}
        className="flex-1 py-3 px-4 rounded-xl text-white font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-1.5 uppercase tracking-wide"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>ORDER NOW (COD)</span>
      </button>

    </div>
  );
};
