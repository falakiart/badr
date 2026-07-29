import React, { useState } from 'react';
import { Phone, MapPin, User, Truck, ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react';
import { BundleOffer, CODOrder, Currency, Language, ThemeConfig } from '../types';
import { BUNDLE_OFFERS, formatPrice, MOROCCAN_CITIES } from '../data/productData';
import { getTranslation } from '../data/translations';

interface OrderFormCODProps {
  currency: Currency;
  theme: ThemeConfig;
  language?: Language;
  selectedBundle: BundleOffer;
  onSelectBundle: (bundle: BundleOffer) => void;
  onOrderSuccess: (order: CODOrder) => void;
  bundles?: BundleOffer[];
}

export const OrderFormCOD: React.FC<OrderFormCODProps> = ({
  currency,
  theme,
  language = 'AR',
  selectedBundle,
  onSelectBundle,
  onOrderSuccess,
  bundles = BUNDLE_OFFERS,
}) => {
  const t = getTranslation(language);
  const bundlesToDisplay = bundles && bundles.length > 0 ? bundles : BUNDLE_OFFERS;
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+212');
  const [city, setCity] = useState('Casablanca');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg(`${t.requiredFields}: ${t.fullName}`);
      return;
    }
    if (!phone.trim() || phone.length < 6) {
      setErrorMsg(`${t.requiredFields}: ${t.phone}`);
      return;
    }
    if (!address.trim()) {
      setErrorMsg(`${t.requiredFields}: ${t.address}`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = 'PB-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder: CODOrder = {
        id: 'ord-' + Date.now(),
        customerName: customerName.trim(),
        phone: `${phonePrefix} ${phone.trim()}`,
        city: city.trim(),
        address: address.trim(),
        bundle: selectedBundle,
        totalMAD: selectedBundle.priceMAD,
        paymentMethod,
        notes: notes.trim(),
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        orderNumber,
        status: 'pending',
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 800);
  };

  return (
    <section id="cod-order-form" className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Form Header */}
        <div 
          className="p-6 text-white text-center space-y-2 relative overflow-hidden"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
            <Truck className="w-3.5 h-3.5" /> {t.orderCod}
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.expressOrderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-xl mx-auto">
            {t.expressOrderSubtitle}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
          
          {/* Step 1: Selected Bundle Summary */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> {t.selectedPackage}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {bundlesToDisplay.map((bundle, index) => {
                const isSelected = selectedBundle.id === bundle.id;
                const bTitle = index === 0 ? t.bundle1Title : index === 1 ? t.bundle2Title : t.bundle3Title;
                const bSubtitle = index === 0 ? t.bundle1Subtitle : index === 1 ? t.bundle2Subtitle : t.bundle3Subtitle;

                return (
                  <button
                    type="button"
                    key={bundle.id}
                    onClick={() => onSelectBundle(bundle)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs text-gray-900">{bTitle}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{bSubtitle}</div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-black text-sm text-emerald-900">
                        {formatPrice(bundle.priceMAD, currency)}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner if any */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Step 2: Customer Contact Information */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  {t.fullName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder={t.fullNamePlaceholder}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-none transition"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  {t.phone} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    className="w-24 px-2 py-3 rounded-xl border border-gray-300 bg-gray-50 text-xs font-bold text-gray-700 outline-none"
                  >
                    <option value="+212">🇲🇦 +212</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder={t.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  {t.city} <span className="text-red-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-none transition bg-white"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  {t.address} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder={t.addressPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-none transition"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  {t.notes}
                </label>
                <input
                  type="text"
                  placeholder={t.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-none transition"
                />
              </div>

            </div>
          </div>

          {/* Step 4: Total Order Price Box & Big Submit Button */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium">{t.selectedPackage}</span>
              <span className="text-xs font-bold text-slate-200">{selectedBundle.bottles === 1 ? t.bundle1Title : selectedBundle.bottles === 2 ? t.bundle2Title : t.bundle3Title}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold">{t.totalToPay}:</div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {t.codGuarantee}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatPrice(selectedBundle.priceMAD, currency)}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: theme.primaryColor }}
              className="w-full py-4 px-6 rounded-xl text-white font-black text-base sm:text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.submitting}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t.confirmOrderBtn}
                </span>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1">🔒 {t.codGuarantee}</span>
              <span>•</span>
              <span className="flex items-center gap-1">⭐ {t.satisfactionGuarantee}</span>
            </div>
          </div>

        </form>

      </div>
    </section>
  );
};
