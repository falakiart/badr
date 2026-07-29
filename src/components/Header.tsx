import React, { useState } from 'react';
import { Globe, Lock, ChevronDown, Check } from 'lucide-react';
import { Language, ThemeConfig } from '../types';

interface HeaderProps {
  currentLang: Language;
  onLangChange: (l: Language) => void;
  theme: ThemeConfig;
  onScrollToOrder?: () => void;
  onOpenAdminSpace?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLangChange,
  theme,
  onOpenAdminSpace,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'AR', label: 'العربية', flag: '🇲🇦' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'EN', label: 'English', flag: '🇬🇧' },
  ];

  const activeLangObj = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm transition-colors duration-300">
      {/* Main Brand Header with Language Selector */}
      <div className="bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E5E2DF] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            {theme.logoUrl ? (
              <img 
                src={theme.logoUrl} 
                alt={theme.logoText || "vola.ma"} 
                className="h-10 max-w-[180px] object-contain rounded-lg" 
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  🌿
                </div>
                <div>
                  <div className="font-black text-xl sm:text-2xl tracking-tight leading-none text-gray-900">
                    {theme.logoText || 'vola.ma'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Options Dropdown & Admin Sign In */}
          <div className="flex items-center gap-2">
            
            {/* Language Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 bg-gray-100/90 hover:bg-gray-200/80 px-3 py-2 rounded-2xl border border-gray-200 text-xs sm:text-sm font-extrabold text-gray-800 transition shadow-2xs"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{activeLangObj.flag}</span>
                <span>{activeLangObj.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsLangOpen(false)} 
                  />
                  
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                    {languages.map((lang) => {
                      const isSelected = currentLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            onLangChange(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition text-left rtl:text-right ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 font-black'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {onOpenAdminSpace && (
              <button
                onClick={onOpenAdminSpace}
                className="p-2 sm:px-3 sm:py-2 bg-gray-900 text-white hover:bg-emerald-700 transition rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                title="Admin Sign In"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};


