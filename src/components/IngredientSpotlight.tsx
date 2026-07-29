import React, { useState } from 'react';
import { Sparkles, Droplets, ShieldCheck, Heart, Leaf, CheckCircle2 } from 'lucide-react';
import { Language, ThemeConfig } from '../types';
import { getTranslation } from '../data/translations';

interface IngredientSpotlightProps {
  theme: ThemeConfig;
  language?: Language;
}

export const IngredientSpotlight: React.FC<IngredientSpotlightProps> = ({ theme, language = 'AR' }) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState(0);

  const ingredients = [
    {
      name: t.cactusTitle,
      role: t.cactusRole,
      description: t.cactusDesc,
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800",
      icon: "🌵"
    },
    {
      name: t.aloeTitle,
      role: t.aloeRole,
      description: t.aloeDesc,
      image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=800",
      icon: "🪴"
    }
  ];

  const benefitsList = [
    { title: t.b1Title, desc: t.b1Desc, icon: "💧" },
    { title: t.b2Title, desc: t.b2Desc, icon: "🌵" },
    { title: t.b3Title, desc: t.b3Desc, icon: "✨" },
    { title: t.b4Title, desc: t.b4Desc, icon: "🌿" }
  ];

  const currentIng = ingredients[activeTab] || ingredients[0];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-emerald-600" /> 100% Natural
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          {t.ingredientTitle}
        </h2>
      </div>

      {/* Ingredient Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Tabs Selector */}
        <div className="lg:col-span-5 space-y-3">
          {ingredients.map((ing, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={ing.name}
                onClick={() => setActiveTab(idx)}
                className={`w-full p-5 rounded-2xl text-left border-2 transition duration-300 ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-lg ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ing.icon}</span>
                    <div>
                      <div className="font-extrabold text-base text-gray-900">{ing.name}</div>
                      <div className="text-xs font-semibold text-emerald-700">{ing.role}</div>
                    </div>
                  </div>
                  {isActive && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Ingredient Card Showcase */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-6 aspect-square rounded-2xl overflow-hidden shadow-md">
              <img
                src={currentIng.image}
                alt={currentIng.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-6 space-y-4">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                {currentIng.role}
              </span>

              <h3 className="text-2xl font-black text-gray-900">
                {currentIng.name}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {currentIng.description}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Grid of Key Benefits Cards */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-gray-900">{t.benefitsTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefitsList.map((item, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-md space-y-2">
              <div className="text-2xl">{item.icon}</div>
              <h4 className="font-extrabold text-sm text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
