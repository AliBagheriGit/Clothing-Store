export function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

export function formatDigits(n: number | string, lang: 'fa' | 'en' = 'fa'): string {
  if (lang === 'en') {
    return n.toString();
  }
  return toPersianDigits(n);
}

export function formatPrice(amount: number, lang: 'fa' | 'en' = 'fa'): string {
  const formatted = amount.toLocaleString('en-US');
  if (lang === 'en') {
    return `${formatted} Tomans`;
  }
  return `${toPersianDigits(formatted)} تومان`;
}
