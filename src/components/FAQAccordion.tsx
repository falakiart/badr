import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface FAQAccordionProps {
  language?: Language;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ language = 'AR' }) => {
  const t = getTranslation(language);
  const [openFaqId, setOpenFaqId] = useState<number | null>(0);

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaqId(openFaqId === idx ? null : idx);
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-gray-900">
            {t.faqTitle}
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqId === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-extrabold text-sm sm:text-base text-gray-900 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between gap-4 transition"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need Help Footer */}
        <div className="p-4 rounded-2xl bg-emerald-50 text-center text-xs text-emerald-900 font-medium flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Have a question?</span>
          </div>
          <a
            href="https://wa.me/212600000000"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl hover:bg-emerald-800 transition shadow-sm whitespace-nowrap"
          >
            Chat on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
