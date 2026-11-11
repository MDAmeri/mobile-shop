import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

// Load Vazirmatn Persian font with optimal performance and zero layout shift
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

// Define SEO metadata in Persian for the store
export const metadata: Metadata = {
  title: "موبایل‌شاپ | فروشگاه تخصصی و مدرن گوشی‌های هوشمند",
  description: "بررسی تخصصی مشخصات، مقایسه، فیلتر پیشرفته و خرید آنلاین جدیدترین موبایل‌های بازار",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body
        className={`${vazirmatn.className} min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-rose-500/30 selection:text-amber-300 overflow-x-hidden`}
      >
        {/* Ambient background gradient blobs for glassmorphism depth */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-500/15 blur-[130px]" />
          <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-rose-500/15 blur-[130px]" />
          <div className="absolute -bottom-32 right-1/3 w-96 h-96 rounded-full bg-amber-400/10 blur-[140px]" />
        </div>

        {/* Main page content injected by Next.js router */}
        {children}
      </body>
    </html>
  );
}