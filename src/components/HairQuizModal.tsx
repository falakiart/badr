import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, HeartHandshake } from 'lucide-react';

interface HairQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBundle: () => void;
}

export const HairQuizModal: React.FC<HairQuizModalProps> = ({ isOpen, onClose, onSelectBundle }) => {
  const [hairType, setHairType] = useState<string>('curly');
  const [hairConcern, setHairConcern] = useState<string>('frizz');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = () => {
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base">Hair Diagnostic Quiz</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!submitted ? (
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-black uppercase text-gray-500 mb-2 block">
                1. What is your natural hair texture?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'straight', label: 'Straight / Fine' },
                  { id: 'wavy', label: 'Wavy 2A - 2C' },
                  { id: 'curly', label: 'Curly 3A - 3C' },
                  { id: 'coily', label: 'Coily 4A - 4C' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHairType(item.id)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition text-left ${
                      hairType === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-gray-500 mb-2 block">
                2. What is your primary hair concern?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'frizz', label: 'Humidity & Frizz' },
                  { id: 'dryness', label: 'Dryness & Dullness' },
                  { id: 'definition', label: 'Lack of Curl Definition' },
                  { id: 'damage', label: 'Color / Heat Damage' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHairConcern(item.id)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition text-left ${
                      hairConcern === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              <span>Calculate My Perfect Hair Routine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-2xl mx-auto flex items-center justify-center">
              🌵
            </div>

            <h4 className="text-xl font-black text-gray-900">
              100% Match for Your Hair!
            </h4>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left text-xs space-y-2">
              <div className="font-extrabold text-emerald-900">
                Custom Recommendation:
              </div>
              <p className="text-gray-700">
                For <strong>{hairType.toUpperCase()}</strong> hair dealing with <strong>{hairConcern.toUpperCase()}</strong>:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-600">
                <li>Dispense <strong>3 pumps</strong> onto towel-dried hair after wash</li>
                <li>Focus on mid-lengths and ends</li>
                <li>Aloe Vera will deeply quench dryness while Cactus Oil locks in moisture without flattening your volume!</li>
              </ul>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectBundle();
              }}
              className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-sm shadow-xl hover:bg-emerald-700 transition"
            >
              ORDER DUO BUNDLE WITH 45% DISCOUNT
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
