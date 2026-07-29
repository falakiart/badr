import React from 'react';
import { CheckCircle2, Truck, PhoneCall, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { CODOrder, Currency, ThemeConfig } from '../types';
import { formatPrice } from '../data/productData';

interface OrderSuccessModalProps {
  order: CODOrder | null;
  currency: Currency;
  theme: ThemeConfig;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  currency,
  theme,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello! I just placed an order on your store:\n\n` +
    `📦 Order #: ${order.orderNumber}\n` +
    `👤 Name: ${order.customerName}\n` +
    `📱 Phone: ${order.phone}\n` +
    `📍 City: ${order.city}\n` +
    `🏠 Address: ${order.address}\n` +
    `🛍️ Package: ${order.bundle.title}\n` +
    `💵 Total Cash Amount: ${formatPrice(order.totalMAD, currency)}\n\n` +
    `Please confirm my delivery! Thank you.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 space-y-0">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold shadow-lg mb-3">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="bg-emerald-400/20 text-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Order Successfully Placed!
          </span>

          <h2 className="text-2xl font-black mt-2">
            THANK YOU FOR YOUR ORDER!
          </h2>

          <p className="text-xs text-emerald-100 mt-1">
            Your Cash on Delivery parcel is being prepared by our fulfillment team.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-5 text-gray-800 text-xs">
          
          {/* Order Number Box */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Order Reference #</div>
              <div className="text-base font-black text-emerald-900 tracking-wider">
                {order.orderNumber}
              </div>
            </div>

            <button
              onClick={handleCopyOrderNumber}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Delivery & Customer Summary */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <div className="font-extrabold text-emerald-900 border-b border-emerald-200/60 pb-2 flex items-center justify-between">
              <span>Delivery Information</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                🚚 24-48h Delivery Window
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Customer:</span>
                <span className="font-bold text-gray-900">{order.customerName}</span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px]">Phone Number:</span>
                <span className="font-bold text-gray-900">{order.phone}</span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px]">Destination City:</span>
                <span className="font-bold text-gray-900">{order.city}</span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px]">Payment Method:</span>
                <span className="font-bold text-emerald-800">
                  {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Credit Card'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60">
              <span className="text-gray-400 block text-[10px]">Street Address:</span>
              <span className="font-bold text-gray-800">{order.address}</span>
            </div>
          </div>

          {/* Items & Total */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Item Ordered</div>
              <div className="font-extrabold text-sm">{order.bundle.title}</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Total Cash</div>
              <div className="text-xl font-black text-emerald-400">
                {formatPrice(order.totalMAD, currency)}
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Confirmation Button */}
          <a
            href={`https://wa.me/${theme.whatsappNumber || '212600000000'}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>FAST-TRACK ON WHATSAPP FOR IMMEDIATE DISPATCH</span>
          </a>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-gray-500 font-semibold hover:underline block pt-1"
          >
            Return to Product Store Page
          </button>

        </div>

      </div>
    </div>
  );
};
