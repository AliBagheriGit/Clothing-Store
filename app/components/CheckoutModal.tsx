'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Truck, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  onOrderComplete: () => void;
}

const IRAN_PROVINCES_FA = [
  'تهران',
  'اصفهان',
  'فارس',
  'خراسان رضوی',
  'گیلان',
  'مازندران',
  'آذربایجان شرقی',
  'خوزستان',
  'البرز',
  'قم',
  'یزد',
  'کرمان',
  'همدان',
  'کرمانشاه',
  'مرکزی',
  'بوشهر',
  'هرمزگان',
];

const IRAN_PROVINCES_EN = [
  'Tehran',
  'Isfahan',
  'Fars',
  'Razavi Khorasan',
  'Gilan',
  'Mazandaran',
  'East Azerbaijan',
  'Khuzestan',
  'Alborz',
  'Qom',
  'Yazd',
  'Kerman',
  'Hamedan',
  'Kermanshah',
  'Markazi',
  'Bushehr',
  'Hormozgan',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onOrderComplete,
}) => {
  const { t, formatPrice, formatDigits, isRTL, language } = useLanguage();
  const isEn = language === 'en';

  if (!isOpen) return null;

  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    phone: '',
    province: isEn ? 'Tehran' : 'تهران',
    city: isEn ? 'Tehran' : 'تهران',
    postalCode: '',
    address: '',
    paymentMethod: 'shaparak',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const provinces = isEn ? IRAN_PROVINCES_EN : IRAN_PROVINCES_FA;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert(t.checkout.requiredAlert);
      return;
    }

    setIsSubmitting(true);
    // Simulate gateway processing
    setTimeout(() => {
      const code = `GLM-${Math.floor(100000 + Math.random() * 900000)}`;
      setTrackingCode(code);
      setIsSubmitting(false);
      setOrderPlaced(true);
      onOrderComplete();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <Truck size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base">
                {orderPlaced ? t.checkout.titleSuccess : t.checkout.title}
              </h2>
              <span className="text-xs text-stone-500">
                {t.checkout.totalAmount} <strong>{formatPrice(totalAmount)}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {orderPlaced ? (
            /* Order Placed Success View */
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 size={44} />
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                {t.checkout.successTitle}
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                {t.checkout.successDesc}
              </p>

              <div className={`bg-stone-50 border border-stone-200 rounded-2xl p-5 max-w-md mx-auto ${
                isRTL ? 'text-right' : 'text-left'
              } space-y-2.5 text-xs sm:text-sm`}>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">{t.checkout.trackingCode}</span>
                  <span className="font-mono font-bold text-pink-600 text-base">
                    {trackingCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{isEn ? 'Recipient:' : 'گیرنده:'}</span>
                  <span className="font-bold text-stone-800">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{isEn ? 'Destination:' : 'شهر مقصد:'}</span>
                  <span className="font-bold text-stone-800">
                    {formData.province} - {formData.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{isEn ? 'Payment:' : 'روش پرداخت:'}</span>
                  <span className="font-bold text-emerald-600">
                    {formData.paymentMethod === 'shaparak'
                      ? (isEn ? 'Shaparak Gateway (Verified)' : 'درگاه پرداخت امن شاپرک (موفق)')
                      : (isEn ? 'Bank Card Transfer' : 'کارت به کارت')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-extrabold text-stone-900">
                  <span>{isEn ? 'Paid Amount:' : 'مبلغ پرداختی:'}</span>
                  <span className="text-pink-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <p className="text-xs text-stone-400">
                {t.checkout.smsNote}
              </p>

              <button
                onClick={onClose}
                className="mt-4 bg-stone-900 hover:bg-black text-white px-8 py-3 rounded-full text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                {t.checkout.backHome}
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipient details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t.checkout.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t.checkout.fullNamePlaceholder}
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t.checkout.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.checkout.phonePlaceholder}
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Province & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t.checkout.province}</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500 bg-white"
                  >
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t.checkout.city}</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={isEn ? 'e.g. Tehran' : 'مثال: تهران'}
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t.checkout.postalCode}</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder={t.checkout.postalCodePlaceholder}
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.checkout.address}
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t.checkout.addressPlaceholder}
                  className="w-full border border-stone-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                />
              </div>

              {/* Payment Gateway */}
              <div className="pt-2">
                <label className="text-xs font-bold text-stone-800 block mb-2">
                  {t.checkout.paymentMethod}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'shaparak'
                        ? 'border-pink-500 bg-pink-50/60 ring-1 ring-pink-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'shaparak'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'shaparak' })}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <CreditCard size={20} className="text-pink-600" />
                    <div className="text-xs">
                      <strong className="block text-stone-800">{t.checkout.shaparak}</strong>
                      <span className="text-stone-500">{t.checkout.shaparakDesc}</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-pink-500 bg-pink-50/60 ring-1 ring-pink-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <ShieldCheck size={20} className="text-stone-700" />
                    <div className="text-xs">
                      <strong className="block text-stone-800">{t.checkout.card}</strong>
                      <span className="text-stone-500">{t.checkout.cardDesc}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security badge & Submit */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span>{isEn ? 'Secured by 256-bit SSL Gateway' : 'تضمین امنیت پرداخت و اطلاعات توسط شبکه شاپرک'}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{t.checkout.processing}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.checkout.submitBtn} ({formatPrice(totalAmount)})</span>
                      {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
