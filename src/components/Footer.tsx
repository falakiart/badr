import React from 'react';
import { ShieldCheck, Truck, PhoneCall, Heart, RotateCcw, Lock } from 'lucide-react';
import { ThemeConfig } from '../types';

interface FooterProps {
  theme: ThemeConfig;
  onScrollToOrder: () => void;
  onOpenAdminSpace?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onScrollToOrder, onOpenAdminSpace }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Top Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              🚚
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Express Delivery</div>
              <div className="text-slate-400">24h to 48h across all cities</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              💵
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Cash on Delivery</div>
              <div className="text-slate-400">Paiement à la livraison 100% safe</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              🌵
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">100% Botanical</div>
              <div className="text-slate-400">Organic Cactus Oil & Aloe Vera</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              📞
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Customer Support</div>
              <div className="text-slate-400">WhatsApp assistance 7 days/week</div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                🌿
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                PHYTO<span className="text-emerald-400">BOTANICA</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Leave-In Hair Mousse enriched with Cactus Oil and Aloe Vera. Deeply hydrates, tames frizz, and softens hair without weighing it down.
            </p>

            <button
              onClick={onScrollToOrder}
              className="bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition"
            >
              Order Now – Cash on Delivery
            </button>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">
              Product Information
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Size: 150ml (5 fl oz)</li>
              <li>• Key Ingredients: Cactus Oil & Aloe Vera</li>
              <li>• Hair Type: All Hair Types</li>
              <li>• Texture: Lightweight Foam Mousse</li>
              <li>• Rinse: No Rinse Required</li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <div className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">
              Need Help with your Order?
            </div>
            <p className="text-slate-400">
              Our customer happiness team is available to assist you with order status, hair care routine advice, and shipping questions.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${theme.whatsappNumber || '212600000000'}?text=Hello%20I%20need%20help`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline"
              >
                <PhoneCall className="w-4 h-4" /> Contact WhatsApp Support ({theme.whatsappNumber || '+212 600-000000'})
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} Leave-In Hair Mousse (Cactus Oil & Aloe Vera 150ml). All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Delivery</span>
            <span>Refund Policy</span>
            {onOpenAdminSpace && (
              <button
                onClick={onOpenAdminSpace}
                className="inline-flex items-center gap-1.5 font-bold text-slate-300 hover:text-emerald-400 transition cursor-pointer"
                title="Sign In / Admin Space"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In / Admin</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
