import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface HowToUseProps {
  language?: Language;
}

export const HowToUse: React.FC<HowToUseProps> = ({ language = 'AR' }) => {
  const t = getTranslation(language);

  const steps = [
    { step: 1, title: t.step1Title, desc: t.step1Desc },
    { step: 2, title: t.step2Title, desc: t.step2Desc },
    { step: 3, title: t.step3Title, desc: t.step3Desc },
    { step: 4, title: t.step4Title, desc: t.step4Desc }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="bg-emerald-50/50 rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> 100% Natural
          </span>

          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {t.howToUseTitle}
          </h2>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md relative flex flex-col justify-between hover:shadow-lg transition"
            >
              {/* Step Number Badge */}
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md">
                0{st.step}
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="font-extrabold text-base text-gray-900">{st.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Easy & Quick
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
