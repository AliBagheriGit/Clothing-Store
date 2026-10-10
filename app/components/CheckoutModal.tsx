'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  onOrderComplete: () => void;
}

const IRAN_PROVINCES = [
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

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    postalCode: '',
    address: '',
    paymentMethod: 'shaparak',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('لطفاً نام، شماره موبایل و آدرس پستی دقیق را وارد فرمایید.');
      return;
    }

    setIsSubmitting(true);
    // Simulate Iranian gateway processing
    setTimeout(() => {
      const code = `GLM-${Math.floor(100000 + Math.random() * 900000)}`;
      setTrackingCode(code);
      setIsSubmitting(false);
      setOrderPlaced(true);
      onOrderComplete();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-right">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
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
                {orderPlaced ? 'تایید و ثبت نهایی سفارش' : 'مشخصات ارسال و تسویه حساب'}
              </h2>
              <span className="text-xs text-stone-500">
                مبلغ کل سفارش: <strong>{formatPrice(totalAmount)}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
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
                سفارش شما با موفقیت در بوتیک ثبت شد!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                بسته‌بندی اختصاصی سفارش شما آغاز گردید و پیامک تایید و کد رهگیری مرسوله تیپاکس به
                شماره <strong>{toPersianDigits(formData.phone)}</strong> ارسال خواهد شد.
              </p>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 max-w-md mx-auto text-right space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">شماره رهگیری سفارش:</span>
                  <span className="font-mono font-bold text-pink-600 text-base">
                    {trackingCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">گیرنده:</span>
                  <span className="font-bold text-stone-800">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">شهر مقصد:</span>
                  <span className="font-bold text-stone-800">
                    {formData.province} - {formData.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">روش پرداخت:</span>
                  <span className="font-bold text-emerald-600">
                    {formData.paymentMethod === 'shaparak'
                      ? 'درگاه پرداخت امن شاپرک (موفق)'
                      : 'کارت به کارت'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-extrabold text-stone-900">
                  <span>مبلغ پرداختی:</span>
                  <span className="text-pink-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-4 bg-stone-900 hover:bg-black text-white px-8 py-3 rounded-full text-sm font-bold shadow-md transition-colors"
              >
                بازگشت به فروشگاه بوتیک
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipient details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    نام و نام خانوادگی تحویل‌گیرنده *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="مثال: مریم محمدی"
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    شماره تلفن همراه (جهت پیامک رهگیری) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Province & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">استان *</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500 bg-white"
                  >
                    {IRAN_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">شهر *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="مثال: تهران"
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">کد پستی</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="۱۰ رقمی"
                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  نشانی پستی دقیق *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                  className="w-full border border-stone-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                />
              </div>

              {/* Payment Gateway */}
              <div className="pt-2">
                <label className="text-xs font-bold text-stone-800 block mb-2">
                  شیوه پرداخت:
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
                      <strong className="block text-stone-800">درگاه پرداخت آنلاین شاپرک</strong>
                      <span className="text-stone-500">تمامی کارت‌های عضو شتاب بانکی</span>
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
                      <strong className="block text-stone-800">کارت به کارت</strong>
                      <span className="text-stone-500">انتقال وجه و ارسال فیش واریزی</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security badge & Submit */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span>تضمین امنیت پرداخت و اطلاعات توسط شبکه شاپرک</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>در حال انتقال به درگاه بانکی...</span>
                    </>
                  ) : (
                    <>
                      <span>پرداخت نهایی {formatPrice(totalAmount)}</span>
                      <ArrowLeft size={16} />
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
