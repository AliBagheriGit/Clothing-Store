'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  PlusCircle,
  Trash2,
  Check,
  Image as ImageIcon,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  UploadCloud,
  FileImage,
  RefreshCw,
} from 'lucide-react';
import { Product, ProductCategory, ProductColor } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdminProductManagerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialTab?: 'list' | 'add';
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStock: (productId: string) => void;
  onUpdateStockCount?: (productId: string, delta: number) => void;
  onResetToDefaults: () => void;
}

const PRESET_COLORS: ProductColor[] = [
  { name: 'کرم نسکافه‌ای', englishName: 'Warm Latte', hex: '#d4c4b5' },
  { name: 'سفید صدفی', englishName: 'Pearl White', hex: '#fdfbf7' },
  { name: 'مشکی کلاسیک', englishName: 'Classic Black', hex: '#1e1e1e' },
  { name: 'سبز سدری', englishName: 'Sage Green', hex: '#8a9a86' },
  { name: 'آبی آسمانی', englishName: 'Sky Blue', hex: '#bed4e8' },
  { name: 'عسلی کاراملی', englishName: 'Caramel Honey', hex: '#9e623b' },
  { name: 'صورتی خاکی', englishName: 'Dusty Rose', hex: '#d9a5b3' },
];

const ALL_SIZES = ['Free Size', 'S', 'M', 'L', 'XL', '2XL', '37', '38', '39', '40', '41', '42', '43'];

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  isOpen,
  onClose,
  products,
  initialTab = 'list',
  onAddProduct,
  onDeleteProduct,
  onToggleStock,
  onUpdateStockCount,
  onResetToDefaults,
}) => {
  const { t, formatPrice, formatDigits, isRTL, language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'settings'>(initialTab);
  const [searchFilter, setSearchFilter] = useState('');

  // Form State for Adding Product
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('women');
  const [price, setPrice] = useState<string>('1200000');
  const [originalPrice, setOriginalPrice] = useState<string>('1500000');
  const [material, setMaterial] = useState(isEn ? '100% Organic Linen' : '۱۰۰٪ لینن ارگانیک اعلا');
  const [description, setDescription] = useState(
    isEn
      ? 'Premium breathable summer fabric, exceptionally cooling and lightweight for sunny days.'
      : 'پارچه باکیفیت و تنفس‌پذیر تابستانه، فوق‌العاده خنک و سبک مناسب روزهای گرم.'
  );
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageFileSize, setImageFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([PRESET_COLORS[0], PRESET_COLORS[1]]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [initialStockCount, setInitialStockCount] = useState<number>(15);
  const [tag, setTag] = useState(isEn ? 'NEW' : 'جدید');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError(isEn ? 'Please choose a valid image file (JPG, PNG, WEBP).' : 'لطفاً یک فایل تصویری معتبر (JPG، PNG یا WEBP) انتخاب کنید.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError(isEn ? 'File size must not exceed 8 MB.' : 'حجم فایل نباید بیشتر از ۸ مگابایت باشد.');
      return;
    }
    setUploadError('');
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setImageFileName(file.name);
    setImageFileSize(`${sizeMB} MB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImageUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleColor = (c: ProductColor) => {
    if (selectedColors.some((item) => item.name === c.name)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((item) => item.name !== c.name));
      }
    } else {
      setSelectedColors([...selectedColors, c]);
    }
  };

  const handleToggleSize = (s: string) => {
    if (selectedSizes.includes(s)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((item) => item !== s));
      }
    } else {
      setSelectedSizes([...selectedSizes, s]);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!imageUrl) {
      setUploadError(isEn ? 'Please upload a product photo.' : 'لطفاً ابتدا عکس یا تصویر محصول را بارگذاری فرمایید.');
      return;
    }

    const numPrice = parseInt(price.replace(/,/g, ''), 10) || 1000000;
    const numOrig = originalPrice ? parseInt(originalPrice.replace(/,/g, ''), 10) : undefined;
    const discountPercent = numOrig && numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : undefined;

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      englishName: englishName.trim() || undefined,
      category: category === 'all' ? 'women' : (category as any),
      price: numPrice,
      originalPrice: numOrig,
      discountPercent,
      image: imageUrl,
      gallery: [imageUrl],
      description: description.trim(),
      englishDescription: description.trim(),
      material: material.trim(),
      englishMaterial: material.trim(),
      colors: selectedColors,
      sizes: selectedSizes,
      rating: 5.0,
      reviewsCount: 1,
      isNew: true,
      isFeatured: true,
      inStock: initialStockCount > 0,
      stockCount: initialStockCount,
      tag: tag || undefined,
      englishTag: tag || undefined,
    };

    onAddProduct(newProd);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setName('');
      setEnglishName('');
      setImageUrl('');
      setImageFileName('');
      setImageFileSize('');
      setInitialStockCount(15);
      setUploadError('');
      setActiveTab('list');
    }, 1200);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (p.englishName && p.englishName.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border border-stone-200 ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white shadow-xs">
              W
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>{isEn ? 'WordPress-Style Boutique Management' : 'پیشخوان وردپرسی مدیریت بوتیک'}</span>
                <span className="text-[11px] bg-stone-800 text-pink-400 px-2 py-0.5 rounded font-mono">
                  {isEn ? 'Store Admin Edition' : 'نسخه مدیریت فروشگاه'}
                </span>
              </h2>
              <span className="text-xs text-stone-400">
                {isEn
                  ? 'Add products directly to catalog, adjust inventory and remove items'
                  : 'افزودن مستقیم اجناس به سایت، ویرایش موجودی و حذف محصولات'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-3 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers size={16} />
            <span>
              {isEn
                ? `Catalog & Delete (${formatDigits(products.length)})`
                : `فهرست و حذف اجناس (${formatDigits(products.length)})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <PlusCircle size={16} />
            <span>{isEn ? '+ Add New Product to Store' : '+ افزودن محصول جدید به سایت'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              isRTL ? 'mr-auto' : 'ml-auto'
            } ${
              activeTab === 'settings'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <RotateCcw size={15} />
            <span>{isEn ? 'Reset Catalog' : 'بازنشانی کاتالوگ'}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-100/50">
          {/* TAB 1: PRODUCT LIST & REMOVE */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Search Bar & Quick Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search size={16} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-stone-400`} />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={isEn ? 'Search products to manage or delete...' : 'جستجو در میان کالاها جهت حذف یا ویرایش...'}
                    className={`w-full bg-stone-50 border border-stone-200 rounded-xl ${
                      isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    } py-2 text-xs focus:outline-hidden focus:border-pink-500`}
                  />
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-3">
                  <span>
                    {isEn ? 'Total Items: ' : 'تعداد کل کالاها: '}
                    <strong className="text-stone-900">{formatDigits(products.length)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {isEn ? 'In Stock: ' : 'کالاهای موجود: '}
                    <strong className="text-emerald-600">
                      {formatDigits(products.filter((p) => p.inStock).length)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => {
                    const pName = isEn && p.englishName ? p.englishName : p.name;
                    const stockNum = p.stockCount ?? (p.inStock ? 10 : 0);

                    return (
                      <div
                        key={p.id}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-stone-50/80 transition-colors"
                      >
                        {/* Image & Title */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl bg-stone-100 bg-cover bg-center shrink-0 border border-stone-200 shadow-2xs"
                            style={{ backgroundImage: `url(${p.image})` }}
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                              {pName}
                            </h4>
                            <span className="text-[11px] text-stone-400 block font-sans">
                              {isEn ? (p.name || p.category) : (p.englishName || p.category)}
                            </span>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-xs font-black text-pink-600">
                                {formatPrice(p.price)}
                              </span>
                              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                                {isEn && p.englishMaterial ? p.englishMaterial.split(' ')[0] : p.material.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stock Controls & Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap justify-end">
                          <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateStockCount?.(p.id, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-stone-200 text-stone-700 font-black border border-stone-200 transition-colors cursor-pointer text-sm shadow-xs"
                              title="-1"
                            >
                              -
                            </button>
                            <div className="text-center px-2 min-w-[54px]">
                              <span className={`block text-xs font-black ${
                                stockNum > 0 ? 'text-stone-900' : 'text-rose-600'
                              }`}>
                                {formatDigits(stockNum)}
                              </span>
                              <span className="text-[9px] text-stone-400 block -mt-0.5">
                                {isEn ? 'pcs' : 'عدد'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onUpdateStockCount?.(p.id, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-stone-200 text-stone-700 font-black border border-stone-200 transition-colors cursor-pointer text-sm shadow-xs"
                              title="+1"
                            >
                              +
                            </button>
                          </div>

                          {/* In-stock toggle */}
                          <button
                            onClick={() => onToggleStock(p.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              stockNum > 0
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                            }`}
                          >
                            {stockNum > 0 ? (isEn ? '✓ In Stock' : '✓ موجود') : (isEn ? 'Out of Stock' : 'ناموجود')}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-rose-200 hover:border-rose-600 cursor-pointer shadow-2xs"
                            title={t.card.deleteAdmin}
                          >
                            <Trash2 size={14} />
                            <span>{t.card.delete}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-stone-400 text-xs">
                      {isEn ? 'No products found.' : 'کالایی یافت نشد.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD PRODUCT FORM */}
          {activeTab === 'add' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form (8 cols) */}
              <div className="lg:col-span-8 bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-black text-stone-900 text-base flex items-center gap-1.5">
                    <PlusCircle size={18} className="text-pink-600" />
                    <span>{isEn ? 'New Product Specifications' : 'مشخصات کالای جدید (انتشار در سایت)'}</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {isEn
                      ? 'Standard product creation form; once saved it immediately appears in boutique showcase.'
                      : 'فرم استاندارد تعریف محصول؛ پس از ثبت بلافاصله در ویترین و دسته‌بندی‌های سایت قرار می‌گیرد.'}
                  </p>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4">
                  {/* Name & English name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'Product Name (Persian) *' : 'نام محصول (فارسی) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="پیراهن لینن ساحلی فلورال"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'English Name (for Journal & SEO)' : 'نام انگلیسی (برای ژورنال و سئو)'}
                      </label>
                      <input
                        type="text"
                        value={englishName}
                        onChange={(e) => setEnglishName(e.target.value)}
                        placeholder="Summer Linen Floral Dress"
                        dir="ltr"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white text-left font-sans"
                      />
                    </div>
                  </div>

                  {/* Category & Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'Boutique Category *' : 'دسته‌بندی بوتیک *'}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white"
                      >
                        <option value="women">{isEn ? "Women's Fashion (women)" : 'پوشاک بانوان (Women)'}</option>
                        <option value="men">{isEn ? "Men's Style (men)" : 'استایل آقایان (Men)'}</option>
                        <option value="shoes">{isEn ? 'Shoes & Slides (shoes)' : 'کفش و صندل (Shoes)'}</option>
                        <option value="bags">{isEn ? 'Beach & Hand Bags (bags)' : 'کیف ساحلی و دستی (Bags)'}</option>
                        <option value="accessories">{isEn ? 'Accessories & Shades (accessories)' : 'اکسسوری و عینک (Accessories)'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'Display Badge / Tag' : 'برچسب ویژه (بج نمایش)'}
                      </label>
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder={isEn ? 'NEW, Best-seller, Summer Sale' : 'جدید، پرفروش، حراج تابستانه'}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Price & Original Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'Price (Tomans) *' : 'قیمت فروش (تومان) *'}
                      </label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="1200000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'Original Price (Optional)' : 'قیمت قبل از تخفیف (اختیاری)'}
                      </label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="1600000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Fabric & Initial Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'Fabric & Material' : 'جنس پارچه و الیاف'}
                      </label>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder={isEn ? '100% Organic Linen' : '۱۰۰٪ لینن ارگانیک شسته شده'}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEn ? 'Initial Stock Count *' : 'موجودی اولیه انبار (تعداد) *'}
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setInitialStockCount((c) => Math.max(0, c - 1))}
                            className="w-9 h-9 flex items-center justify-center text-stone-700 hover:bg-stone-200 font-black text-sm cursor-pointer"
                            title="-1"
                          >
                            -
                          </button>
                          <span className="w-16 text-center font-black text-xs text-stone-900 bg-white py-2 border-x border-stone-200">
                            {formatDigits(initialStockCount)} {isEn ? 'pcs' : 'عدد'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setInitialStockCount((c) => c + 1)}
                            className="w-9 h-9 flex items-center justify-center text-stone-700 hover:bg-stone-200 font-black text-sm cursor-pointer"
                            title="+1"
                          >
                            +
                          </button>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                          initialStockCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {initialStockCount > 0 ? (isEn ? 'In Stock' : 'موجود در انبار') : (isEn ? 'Out of Stock' : 'ناموجود')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {isEn ? 'Product Image *' : 'تصویر و عکس محصول *'}
                      </label>
                      <span className="text-[11px] text-stone-400">
                        {isEn ? 'JPG, PNG, WEBP (Max 8 MB)' : 'فرمت‌های JPG، PNG، WEBP (حداکثر ۸ مگابایت)'}
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          processFile(e.target.files[0]);
                        }
                      }}
                    />

                    {!imageUrl ? (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files?.[0]) {
                            processFile(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                          isDragging
                            ? 'border-pink-500 bg-pink-50/60 scale-[0.99]'
                            : 'border-stone-300 hover:border-pink-500 bg-stone-50/70 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shadow-xs">
                          <UploadCloud size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-stone-800 text-xs sm:text-sm">
                            {isEn ? 'Click to upload image or drag and drop here' : 'برای بارگذاری عکس کلیک کنید یا تصویر را به اینجا بکشید و رها کنید'}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            {isEn ? 'Upload directly from your device' : 'عکس محصول به صورت مستقیم از سیستم یا گوشی شما آپلود می‌شود'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="bg-stone-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer mt-1"
                        >
                          <FileImage size={15} />
                          <span>{isEn ? 'Browse & Upload Photo' : 'انتخاب و بارگذاری عکس محصول'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div
                            className="w-16 h-20 rounded-xl bg-stone-200 bg-cover bg-center border border-stone-300 shrink-0 shadow-2xs"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>{isEn ? 'Image uploaded successfully' : 'تصویر با موفقیت بارگذاری شد'}</span>
                            </div>
                            <span className="text-xs text-stone-700 font-medium truncate block max-w-xs" dir="ltr">
                              {imageFileName || 'product.jpg'}
                            </span>
                            {imageFileSize && (
                              <span className="text-[11px] text-stone-400 block mt-0.5">
                                {isEn ? 'File size: ' : 'حجم فایل: '} {imageFileSize}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            <RefreshCw size={13} />
                            <span>{isEn ? 'Change Photo' : 'تغییر عکس'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl('');
                              setImageFileName('');
                              setImageFileSize('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>{isEn ? 'Remove Photo' : 'حذف عکس'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {uploadError && (
                      <div className="mt-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
                        <AlertTriangle size={14} />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1.5">
                      {isEn ? 'Available Colors:' : 'رنگ‌های قابل انتخاب:'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((c, i) => {
                        const isSelected = selectedColors.some((item) => item.name === c.name);
                        const cName = isEn && c.englishName ? c.englishName : c.name;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleToggleColor(c)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold'
                                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-stone-300"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{cName}</span>
                            {isSelected && <Check size={12} className="text-pink-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1.5">
                      {isEn ? 'Available Sizes:' : 'سایزهای موجود:'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_SIZES.map((s) => {
                        const isSelected = selectedSizes.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleToggleSize(s)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {isEn ? 'Product Description' : 'توضیحات معرفی لباس'}
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-hidden focus:border-pink-500 focus:bg-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    {formSuccess ? (
                      <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>{isEn ? 'Product published successfully! Redirecting...' : 'محصول با موفقیت در فروشگاه منتشر شد! در حال انتقال...'}</span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer transition-all"
                      >
                        <PlusCircle size={18} />
                        <span>{isEn ? 'Publish and Add Product to Boutique Showcase' : 'انتشار و اضافه کردن محصول به ویترین فروشگاه'}</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Live Preview (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="bg-stone-900 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-pink-400" />
                  <span>{isEn ? 'Live Showcase Preview' : 'پیش‌نمایش زنده در ویترین سایت'}</span>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md">
                  <div className="relative aspect-3/4 bg-stone-100 flex items-center justify-center">
                    {imageUrl ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-stone-400 p-6 text-center gap-2">
                        <ImageIcon size={36} className="text-stone-300" />
                        <span className="text-xs font-medium">
                          {isEn ? 'Uploaded image will preview here' : 'تصویر بارگذاری‌شده در اینجا پیش‌نمایش می‌شود'}
                        </span>
                      </div>
                    )}
                    {tag && (
                      <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                        {tag}
                      </span>
                    )}
                  </div>
                  <div className={`p-4 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="text-[10px] text-pink-600 font-bold block">{material}</span>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {isEn ? (englishName || name || 'Product Name') : (name || 'نام محصول شما')}
                    </h4>
                    <div className="flex items-center gap-1">
                      {selectedColors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-stone-300"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                    <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                      <span className="font-black text-pink-600 text-sm">
                        {formatPrice(parseInt(price.replace(/,/g, ''), 10) || 0)}
                      </span>
                      {originalPrice && (
                        <span className="text-[11px] text-stone-400 line-through">
                          {formatPrice(parseInt(originalPrice.replace(/,/g, ''), 10) || 0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESET TO DEFAULTS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={28} />
              </div>
              <h3 className="font-extrabold text-stone-900 text-base">
                {isEn ? 'Reset Boutique Catalog to Defaults' : 'بازنشانی اجناس فروشگاه به داده‌های اولیه'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {isEn
                  ? 'If you have added or removed items and want to reset the store back to the 12 original curated items, click below.'
                  : 'در صورتی که محصولاتی را حذف یا اضافه کرده‌اید و می‌خواهید کاتالوگ فروشگاه به ۱۲ محصول پیش‌فرض ژورنالی برگردد، از این دکمه استفاده کنید.'}
              </p>
              <button
                onClick={() => {
                  if (window.confirm(isEn ? 'Are you sure you want to reset all products to default?' : 'آیا از بازنشانی کامل محصولات به حالت اولیه مطمئن هستید؟')) {
                    onResetToDefaults();
                    alert(isEn ? 'Catalog reset to defaults successfully.' : 'کاتالوگ با موفقیت به حالت پیش‌فرض بازگردانده شد.');
                    setActiveTab('list');
                  }
                }}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isEn ? 'Confirm & Reset Catalog' : 'تایید و بازنشانی محصولات'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
