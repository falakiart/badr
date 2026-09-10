import React from 'react';
import { X, Check, Settings2, Sparkles, Layout, Flame, Bell, Phone, Package, Type } from 'lucide-react';
import { ThemeConfig, ThemePreset } from '../types';

interface WordPressCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  onUpdateTheme: (newTheme: Partial<ThemeConfig>) => void;
}

const PRESETS: Record<ThemePreset, { name: string; primary: string; accent: string; bg: string; cardBg: string }> = {
  botanical: {
    name: 'Clean Beige & Verdant (Default)',
    primary: '#2F3E30',
    accent: '#8AA48A',
    bg: '#FDFCFB',
    cardBg: '#F4F1ED',
  },
  organic: {
    name: 'Warm Olive & Sand',
    primary: '#4d7c0f', // lime-700
    accent: '#c2410c', // orange-700
    bg: '#fefce8',
    cardBg: '#ffffff',
  },
  rosegold: {
    name: 'Rose Gold & Luxe Pink',
    primary: '#be185d', // pink-700
    accent: '#b45309', // amber-700
    bg: '#fff1f2',
    cardBg: '#ffffff',
  },
  darkvelvet: {
    name: 'Dark Forest Velvet',
    primary: '#059669', // emerald-600
    accent: '#f59e0b', // amber-500
    bg: '#0f172a',
    cardBg: '#1e293b',
  },
};

export const WordPressCustomizer: React.FC<WordPressCustomizerProps> = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
}) => {
  if (!isOpen) return null;

  const handlePresetSelect = (presetKey: ThemePreset) => {
    const preset = PRESETS[presetKey];
    onUpdateTheme({
      preset: presetKey,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      bgColor: preset.bg,
      cardBg: preset.cardBg,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">WordPress Theme Customizer</h2>
              <p className="text-xs text-slate-400">Live Customizer for Hair Mousse Product Page</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Options */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* Theme Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Theme Color Palette Presets</span>
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {(Object.keys(PRESETS) as ThemePreset[]).map((key) => {
                const item = PRESETS[key];
                const isSelected = theme.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1">
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-sm inline-block"
                          style={{ backgroundColor: item.primary }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-sm inline-block"
                          style={{ backgroundColor: item.accent }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Name & Subtitle Customizer */}
          <div className="space-y-3 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-700" />
              <span>اسم وتفاصيل المنتج (Product Name & Info)</span>
            </label>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>اسم المنتج الرئيسي (Titre du produit)</span>
                  <span className="text-[10px] text-emerald-800 font-bold">H1 Title</span>
                </label>
                <input
                  type="text"
                  value={theme.productTitle ?? ''}
                  onChange={(e) => onUpdateTheme({ productTitle: e.target.value })}
                  placeholder="موس الشعر بالصبار وزيت التين الشوكي – بدون غسل"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-bold text-slate-900 bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  الوصف الترويجي المختصر (Sous-titre)
                </label>
                <textarea
                  rows={2}
                  value={theme.productSubtitle ?? ''}
                  onChange={(e) => onUpdateTheme({ productSubtitle: e.target.value })}
                  placeholder="رغوة نباتية خفيفة ترطب وتفك التشابك وتمنح لمعاناً حريرياً..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-medium text-slate-800 bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  الشارة الترويجية (Badge / Tag)
                </label>
                <input
                  type="text"
                  value={theme.productBadge ?? ''}
                  onChange={(e) => onUpdateTheme({ productBadge: e.target.value })}
                  placeholder="الأكثر طلباً ومبيعاً في المغرب 🇲🇦"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-bold text-slate-900 bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  نص تنبيه المخزون (Stock Urgency)
                </label>
                <input
                  type="text"
                  value={theme.stockAlertText ?? ''}
                  onChange={(e) => onUpdateTheme({ stockAlertText: e.target.value })}
                  placeholder="فقط 14 عبوة متبقية في المخزون!"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-bold text-slate-900 bg-white shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* E-Commerce High Conversion Features */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-emerald-600" />
              <span>Conversion Booster Modules</span>
            </label>

            <div className="space-y-3">
              
              {/* Direct COD Form Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Direct COD Form</div>
                    <div className="text-xs text-slate-500">Show Cash on Delivery checkout form directly on page</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={theme.showCodForm}
                  onChange={(e) => onUpdateTheme({ showCodForm: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>

              {/* Urgency Stock Timer Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Stock & Urgency Bar</div>
                    <div className="text-xs text-slate-500">Display "Only 14 bottles remaining" countdown</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={theme.showStockTimer}
                  onChange={(e) => onUpdateTheme({ showStockTimer: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>

              {/* Live Sales Toast Notifications Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Live Order Popups</div>
                    <div className="text-xs text-slate-500">Show social proof notifications ("Meryem from Rabat just bought...")</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={theme.showLiveSales}
                  onChange={(e) => onUpdateTheme({ showLiveSales: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>

              {/* Sticky Mobile Bar Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Layout className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Sticky Bottom Mobile Bar</div>
                    <div className="text-xs text-slate-500">Persistent bottom CTA on mobile screens</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={theme.showStickyBar}
                  onChange={(e) => onUpdateTheme({ showStickyBar: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>

            </div>
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <span>💡 WordPress Theme Customizer</span>
            </div>
            <p>
              This landing page is modeled after top converting WooCommerce themes (Astra, Elementor COD Landing, Divi). All changes apply instantly in real-time.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => handlePresetSelect('botanical')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
