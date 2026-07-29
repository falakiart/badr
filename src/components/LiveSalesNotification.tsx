import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import { RECENT_SALES } from '../data/productData';

export const LiveSalesNotification: React.FC = () => {
  const [currentSaleIndex, setCurrentSaleIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first toast after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Cycle through sales every 12 seconds
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSaleIndex((prev) => (prev + 1) % RECENT_SALES.length);
        setIsVisible(true);
      }, 800);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, []);

  if (!isVisible) return null;

  const sale = RECENT_SALES[currentSaleIndex];

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-xs bg-white rounded-2xl shadow-2xl border border-emerald-200 p-3.5 flex items-center gap-3 animate-slide-up transition-all">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
        <ShoppingBag className="w-5 h-5 text-emerald-700" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-[11px] font-extrabold text-gray-900 truncate">
          <span>{sale.name}</span>
          <span className="text-gray-400 font-normal">from {sale.city}</span>
        </div>
        <div className="text-[10px] font-semibold text-emerald-700 truncate">
          Bought {sale.bundle}
        </div>
        <div className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Verified Order • {sale.timeAgo}</span>
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
