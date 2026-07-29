import React, { useState } from 'react';
import { Sparkles, Sliders } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface BeforeAfterSliderProps {
  language?: Language;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ language = 'AR' }) => {
  const t = getTranslation(language);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> {t.beforeAfterTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.beforeAfterTitle}
          </h2>
        </div>

        {/* Interactive Image Container */}
        <div className="relative max-w-3xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 select-none">
          
          {/* After Image (Full background) */}
          <img
            src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1200"
            alt="After Leave-In Hair Mousse"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute top-4 right-4 z-10 bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
            {t.afterLabel}
          </span>

          {/* Before Image (Clipped overlay) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200"
              alt="Before Leave-In Hair Mousse"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50"
            />
            <span className="absolute top-4 left-4 z-10 bg-slate-800/90 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
              {t.beforeLabel}
            </span>
          </div>

          {/* Slider Line Divider */}
          <div
            className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-2xl flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-white text-emerald-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-emerald-600">
              <Sliders className="w-5 h-5 rotate-90" />
            </div>
          </div>

          {/* Hidden Range Input overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderMove}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

        </div>

      </div>

    </section>
  );
};
