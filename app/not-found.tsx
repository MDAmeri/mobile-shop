import Link from "next/link";
import { Smartphone, ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto">
          <Smartphone className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
          خطای ۴۰۴
        </h1>
        <h2 className="text-lg font-bold text-white">صفحه مورد نظر شما پیدا نشد!</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          مسیر یا صفحه‌ای که به دنبال آن هستید در فروشگاه وجود ندارد یا جابه‌جا شده است.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به صفحه اصلی فروشگاه
        </Link>
      </div>
    </div>
  );
}