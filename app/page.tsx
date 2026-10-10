'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryCards } from './components/CategoryCards';
import { ProductCard } from './components/ProductCard';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { PromoBanners } from './components/PromoBanners';
import { TrustBadges } from './components/TrustBadges';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { AdminBar } from './components/AdminBar';
import { AdminProductManager } from './components/AdminProductManager';
import { UserAccountModal } from './components/UserAccountModal';
import { PRODUCTS } from './mockData';
import type { Product, CartItem, ProductCategory, ProductColor, User, UserOrder } from './types';
import { toPersianDigits } from './utils';

import { SlidersHorizontal, CheckCircle2, Trash2 } from 'lucide-react';

export default function Home() {
  // 1. Products state with persistence
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');

  // Unified User state (both for customers and admin)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  // Product pending delete state for custom confirmation modal
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);

  // Admin Product Manager Modal
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState<boolean>(false);
  const [adminManagerTab, setAdminManagerTab] = useState<'list' | 'add'>('list');

  // Load products & user session from localStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('glamour_boutique_products');
      if (savedProducts) {
        const parsed: Product[] = JSON.parse(savedProducts);
        const hydrated = parsed.map((p) => ({
          ...p,
          stockCount: p.stockCount !== undefined ? p.stockCount : (p.inStock ? 12 : 0),
        }));
        setProducts(hydrated);
      } else {
        setProducts(
          PRODUCTS.map((p) => ({
            ...p,
            stockCount: p.stockCount !== undefined ? p.stockCount : (p.inStock ? 12 : 0),
          }))
        );
      }
      const savedUser = localStorage.getItem('glamour_user_session');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore in private browsing
    }
  }, []);

  // Save products when modified
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('glamour_boutique_products', JSON.stringify(newProducts));
    } catch {}
  };

  // Save user session
  const handleUserLogin = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('glamour_user_session', JSON.stringify(user));
    } catch {}

    if (user.role === 'admin') {
      showToast('خوش آمدید مدیر گرامی! پیشخوان مدیریت محصولات فعال شد.');
    } else {
      showToast(`خوش آمدید، ${user.name} عزیز! حساب کاربری شما فعال است.`);
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('glamour_user_session');
    } catch {}
    setIsAdminManagerOpen(false);
    showToast('با موفقیت از حساب کاربری خارج شدید.');
  };

  // Initial cart with a preloaded boutique item for immediate interactive experience
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: `${PRODUCTS[0].id}-${PRODUCTS[0].colors[0].name}-${PRODUCTS[0].sizes[0]}`,
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: PRODUCTS[0].colors[0],
      selectedSize: PRODUCTS[0].sizes[0],
    },
  ]);

  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[1]]);

  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 2. Admin Handlers (Accessible only when currentUser.role === 'admin')
  const handleAddProduct = (newProduct: Product) => {
    if (currentUser?.role !== 'admin') {
      alert('تنها مدیر سایت مجاز به افزودن محصول است.');
      return;
    }
    const updated = [newProduct, ...products];
    saveProducts(updated);
    showToast(`کالای «${newProduct.name}» با موفقیت در سایت منتشر شد.`);
  };

  const handleRequestDelete = (productId: string) => {
    if (currentUser?.role !== 'admin') {
      setIsAccountOpen(true);
      showToast('جهت حذف محصول از سایت، لطفاً با حساب کاربری مدیر وارد شوید.');
      return;
    }
    const target = products.find((p) => p.id === productId);
    if (target) {
      setProductPendingDelete(target);
    }
  };

  const handleConfirmDelete = (productId: string) => {
    if (currentUser?.role !== 'admin') {
      showToast('تنها مدیر سایت مجاز به حذف محصول است.');
      return;
    }
    const target = products.find((p) => p.id === productId);
    const updated = products.filter((p) => p.id !== productId);
    saveProducts(updated);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    if (quickViewProduct?.id === productId) {
      setQuickViewProduct(null);
    }
    showToast(`کالای «${target?.name || ''}» با موفقیت از فروشگاه حذف شد.`);
  };

  const handleToggleStock = (productId: string) => {
    if (currentUser?.role !== 'admin') {
      return;
    }
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextStock = !p.inStock;
        const currentCount = p.stockCount !== undefined ? p.stockCount : (p.inStock ? 10 : 0);
        const nextCount = nextStock ? (currentCount > 0 ? currentCount : 10) : 0;
        showToast(
          nextStock
            ? `«${p.name}» اکنون در انبار موجود شد (موجودی: ${nextCount} عدد).`
            : `«${p.name}» به عنوان ناموجود ثبت شد.`
        );
        return { ...p, inStock: nextStock, stockCount: nextCount };
      }
      return p;
    });
    saveProducts(updated);
    if (quickViewProduct?.id === productId) {
      setQuickViewProduct((prev) => {
        if (!prev) return null;
        const nextStock = !prev.inStock;
        const currentCount = prev.stockCount !== undefined ? prev.stockCount : (prev.inStock ? 10 : 0);
        const nextCount = nextStock ? (currentCount > 0 ? currentCount : 10) : 0;
        return { ...prev, inStock: nextStock, stockCount: nextCount };
      });
    }
  };

  const handleUpdateStockCount = (productId: string, delta: number) => {
    if (currentUser?.role !== 'admin') {
      showToast('تنها مدیر سایت امکان تغییر موجودی انبار را دارد.');
      return;
    }
    let targetName = '';
    let newCountResult = 0;
    const updated = products.map((p) => {
      if (p.id === productId) {
        const currentCount = p.stockCount !== undefined ? p.stockCount : (p.inStock ? 10 : 0);
        const nextCount = Math.max(0, currentCount + delta);
        const nextInStock = nextCount > 0;
        targetName = p.name;
        newCountResult = nextCount;
        return {
          ...p,
          stockCount: nextCount,
          inStock: nextInStock,
        };
      }
      return p;
    });

    saveProducts(updated);

    if (quickViewProduct?.id === productId) {
      setQuickViewProduct((prev) => {
        if (!prev) return null;
        const currentCount = prev.stockCount !== undefined ? prev.stockCount : (prev.inStock ? 10 : 0);
        const nextCount = Math.max(0, currentCount + delta);
        return {
          ...prev,
          stockCount: nextCount,
          inStock: nextCount > 0,
        };
      });
    }

    if (newCountResult === 0) {
      showToast(`موجودی «${targetName}» به پایان رسید و ناموجود شد.`);
    } else {
      showToast(`موجودی «${targetName}» به ${newCountResult} عدد تغییر یافت.`);
    }
  };

  const handleResetToDefaults = () => {
    if (currentUser?.role !== 'admin') return;
    setProducts(PRODUCTS);
    try {
      localStorage.removeItem('glamour_boutique_products');
    } catch {}
    showToast('محصولات با موفقیت به کاتالوگ پیش‌فرض بازگردانده شدند.');
  };

  // 3. Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // popular
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  // 4. Cart Handlers
  const handleAddToCart = (
    product: Product,
    color?: ProductColor,
    size?: string,
    quantity: number = 1
  ) => {
    if (!product.inStock) {
      alert('این کالا متاسفانه در انبار ناموجود می‌باشد.');
      return;
    }

    const finalColor = color || product.colors[0];
    const finalSize = size || product.sizes[0];
    const itemKey = `${product.id}-${finalColor.name}-${finalSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          product,
          quantity,
          selectedColor: finalColor,
          selectedSize: finalSize,
        },
      ];
    });

    showToast(`«${product.name}» با موفقیت به سبد خرید افزوده شد.`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // 5. Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`«${product.name}» از لیست نشان‌شده‌ها حذف شد.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`«${product.name}» به علاقه‌مندی‌ها اضافه شد ❤️`);
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  // 6. Checkout & Order Completion
  const totalCartAmount = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const ship = sub >= 1000000 || sub === 0 ? 0 : 55000;
    return sub + ship;
  }, [cart]);

  const handleOrderComplete = () => {
    // If a user is logged in, attach this order to their history
    if (currentUser) {
      const newOrder: UserOrder = {
        id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
        date: 'امروز',
        itemsCount: cart.reduce((a, b) => a + b.quantity, 0),
        totalAmount: totalCartAmount,
        status: 'در حال بسته‌بندی',
        trackingCode: `GLM-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      const updatedUser: User = {
        ...currentUser,
        orders: [newOrder, ...currentUser.orders],
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('glamour_user_session', JSON.stringify(updatedUser));
      } catch {}
    }
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 0. WordPress-style Admin Toolbar (VISIBLE EXCLUSIVELY FOR ADMIN ROLE) */}
      {isAdmin && (
        <AdminBar
          productsCount={products.length}
          onOpenAddProduct={() => {
            setAdminManagerTab('add');
            setIsAdminManagerOpen(true);
          }}
          onOpenManageProducts={() => {
            setAdminManagerTab('list');
            setIsAdminManagerOpen(true);
          }}
          onLogout={handleUserLogout}
        />
      )}

      {/* 1. Header with Unified User Account Trigger */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAccountModal={() => setIsAccountOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Slider */}
        <HeroSlider />

        {/* 3. Category Showcase ('Best For You' 5-column grid from theme) */}
        <CategoryCards
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          selectedCategory={selectedCategory}
        />

        {/* 4. Featured Products Section */}
        <section id="featured-products" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-100 gap-4 text-right">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-bold text-xs sm:text-sm tracking-wider uppercase">
                  انتخاب‌های ویژه بوتیک
                </span>
                {isAdmin && (
                  <span className="bg-stone-900 text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    پیشخوان مدیریت ادمین
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-stone-900 mt-1">
                کالکشن تابستانه و محصولات منتخب
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                نمایش {toPersianDigits(filteredProducts.length)} محصول آماده ارسال به سراسر ایران
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'همه محصولات' },
                { id: 'women', label: 'پوشاک بانوان' },
                { id: 'men', label: 'استایل آقایان' },
                { id: 'shoes', label: 'کفش و صندل' },
                { id: 'bags', label: 'کیف ساحلی' },
                { id: 'accessories', label: 'اکسسوری' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as ProductCategory)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort bar & Admin quick actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/60 gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-pink-600" />
              <span className="font-bold text-stone-800">مرتب‌سازی:</span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'popular', label: 'محبوب‌ترین' },
                  { id: 'newest', label: 'جدیدترین' },
                  { id: 'price-asc', label: 'ارزان‌ترین' },
                  { id: 'price-desc', label: 'گران‌ترین' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      sortBy === s.id
                        ? 'bg-white font-extrabold text-pink-600 shadow-xs'
                        : 'hover:text-stone-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick add product button for Admin */}
            {isAdmin ? (
              <button
                onClick={() => {
                  setAdminManagerTab('add');
                  setIsAdminManagerOpen(true);
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs transition-colors cursor-pointer shadow-xs"
              >
                <span>+ افزودن محصول به این لیست</span>
              </button>
            ) : (
              <span className="hidden sm:inline text-stone-400">
                ضمانت بازگشت وجه تا ۷ روز پس از تحویل
              </span>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some((p) => p.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                isAdmin={isAdmin}
                onDeleteProduct={handleRequestDelete}
                onUpdateStockCount={handleUpdateStockCount}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-16 text-center text-stone-400 space-y-2">
              <p className="text-base font-bold text-stone-700">هیچ محصولی در این دسته‌بندی یافت نشد.</p>
              {isAdmin && (
                <button
                  onClick={() => {
                    setAdminManagerTab('add');
                    setIsAdminManagerOpen(true);
                  }}
                  className="mt-3 bg-pink-600 text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  افزودن اولین کالا به این دسته
                </button>
              )}
            </div>
          )}
        </section>

        {/* 5. Editorial Promo Banners */}
        <PromoBanners onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* 6. Trust Badges */}
        <TrustBadges />

        {/* 7. Testimonials */}
        <Testimonials />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* --- MODALS & DRAWERS --- */}

      {/* Unified User Account Modal (Role-Based for Customer & Admin) */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLogin={handleUserLogin}
        onLogout={handleUserLogout}
        onOpenAddProduct={() => {
          setAdminManagerTab('add');
          setIsAdminManagerOpen(true);
        }}
        onOpenManageProducts={() => {
          setAdminManagerTab('list');
          setIsAdminManagerOpen(true);
        }}
      />

      {/* WordPress-style Admin Product Manager (Accessible by Admin) */}
      {isAdmin && (
        <AdminProductManager
          isOpen={isAdminManagerOpen}
          onClose={() => setIsAdminManagerOpen(false)}
          products={products}
          initialTab={adminManagerTab}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleRequestDelete}
          onToggleStock={handleToggleStock}
          onUpdateStockCount={handleUpdateStockCount}
          onResetToDefaults={handleResetToDefaults}
        />
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, color, size, qty) => handleAddToCart(p, color, size, qty)}
        isAdmin={isAdmin}
        onDeleteProduct={handleRequestDelete}
        onUpdateStockCount={handleUpdateStockCount}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        totalAmount={totalCartAmount}
        onOrderComplete={handleOrderComplete}
      />

      {/* Custom Delete Confirmation Modal */}
      {productPendingDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn text-right">
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-stone-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-base">
                  حذف محصول از سایت
                </h3>
                <span className="text-xs text-stone-400">عملیات حذف مستقیم ویژه مدیر سایت</span>
              </div>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              آیا از حذف محصول <strong className="text-stone-900 font-bold">«{productPendingDelete.name}»</strong> از ویترین و کاتالوگ فروشگاه اطمینان دارید؟ این عملیات بلافاصله اعمال خواهد شد.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductPendingDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  handleConfirmDelete(productPendingDelete.id);
                  setProductPendingDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={15} />
                <span>بله، حذف از سایت</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xs border border-stone-800 flex items-center gap-3 animate-fadeIn text-right text-xs sm:text-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
