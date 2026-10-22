export type Language = 'fa' | 'en';

export type ProductCategory = 'all' | 'women' | 'men' | 'shoes' | 'bags' | 'accessories';

export interface ProductColor {
  name: string;
  englishName?: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  englishName?: string;
  category: 'women' | 'men' | 'shoes' | 'bags' | 'accessories';
  price: number; // In Iranian Toman
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  gallery?: string[];
  description: string;
  englishDescription?: string;
  material: string;
  englishMaterial?: string;
  colors: ProductColor[];
  sizes: string[];
  englishSizes?: string[];
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  stockCount?: number;
  tag?: string;
  englishTag?: string;
}

export interface CartItem {
  id: string; // unique item cart key (productId + color + size)
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
  selectedSize: string;
}

export interface CategoryCardData {
  id: string;
  title: string;
  englishTitle: string;
  image: string;
  linkCategory: ProductCategory;
  itemCount: number;
}

export interface HeroSlide {
  id: number;
  badge: string;
  englishBadge?: string;
  title: string;
  englishTitle?: string;
  subtitle: string;
  description: string;
  englishDescription?: string;
  buttonText: string;
  englishButtonText?: string;
  link: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  englishName?: string;
  city: string;
  englishCity?: string;
  comment: string;
  englishComment?: string;
  rating: number;
  avatar: string;
  verified: boolean;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  paymentMethod: 'shaparak' | 'card' | 'cod';
  notes?: string;
}

export type UserRole = 'admin' | 'customer';

export interface UserOrder {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: 'در حال بسته‌بندی' | 'ارسال شده با تیپاکس' | 'تحویل شده';
  englishStatus?: string;
  trackingCode: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  joinedDate: string;
  orders: UserOrder[];
}

export const APP_TYPES = true;



