import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glamour Boutique | بوتیک گلامور | فروشگاه آنلاین پوشاک و استایل تابستانه",
  description: "Boutique fashion and resort lifestyle store. فروشگاه تخصصی پوشاک زنانه و مردانه، پیراهن‌های لینن، صندل چرم و اکسسوری ساحلی با ارسال سریع به سراسر کشور",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900 font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
