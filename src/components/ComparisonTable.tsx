import React from 'react';
import { Check, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface ComparisonTableProps {
  language?: Language;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ language = 'AR' }) => {
  const t = getTranslation(language);

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t.comparisonTitle}
          </h2>
        </div>

        {/* Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-gray-100 text-xs font-black uppercase text-gray-400">
                <th className="py-4 px-4">{t.comparisonTitle}</th>
                <th className="py-4 px-4 bg-emerald-50/80 text-emerald-900 rounded-t-xl text-center font-extrabold">
                  🌿 {t.us}
                </th>
                <th className="py-4 px-4 text-center">{t.others}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-bold text-gray-700">
              
              <tr>
                <td className="py-4 px-4 font-extrabold text-gray-900">{t.feature1}</td>
                <td className="py-4 px-4 bg-emerald-50/80 text-center text-emerald-700 font-extrabold">
                  <Check className="w-5 h-5 mx-auto text-emerald-600" />
                </td>
                <td className="py-4 px-4 text-center text-red-500">
                  <X className="w-4 h-4 mx-auto" />
                </td>
              </tr>

              <tr>
                <td className="py-4 px-4 font-extrabold text-gray-900">{t.feature2}</td>
                <td className="py-4 px-4 bg-emerald-50/80 text-center text-emerald-700 font-extrabold">
                  <Check className="w-5 h-5 mx-auto text-emerald-600" />
                </td>
                <td className="py-4 px-4 text-center text-red-500">
                  <X className="w-4 h-4 mx-auto" />
                </td>
              </tr>

              <tr>
                <td className="py-4 px-4 font-extrabold text-gray-900">{t.feature3}</td>
                <td className="py-4 px-4 bg-emerald-50/80 text-center text-emerald-700 font-extrabold">
                  <Check className="w-5 h-5 mx-auto text-emerald-600" />
                </td>
                <td className="py-4 px-4 text-center text-red-500">
                  <X className="w-4 h-4 mx-auto" />
                </td>
              </tr>

              <tr>
                <td className="py-4 px-4 font-extrabold text-gray-900">{t.feature4}</td>
                <td className="py-4 px-4 bg-emerald-50/80 text-center text-emerald-700 font-extrabold rounded-b-xl">
                  <Check className="w-5 h-5 mx-auto text-emerald-600" />
                </td>
                <td className="py-4 px-4 text-center text-red-500">
                  <X className="w-4 h-4 mx-auto" />
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
