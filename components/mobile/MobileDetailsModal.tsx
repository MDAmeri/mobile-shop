"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Cpu,
  HardDrive,
  Smartphone,
  BatteryCharging,
  Camera,
  Wifi,
  Layers,
  ShoppingCart,
  ShieldCheck,
  Star,
} from "lucide-react";
import { MobileProduct } from "@/core/entities/mobile.entity";

interface MobileDetailsModalProps {
  mobile: MobileProduct | null;
  onClose: () => void;
  onAddToCart: (product: MobileProduct) => void;
}

export default function MobileDetailsModal({
  mobile,
  onClose,
  onAddToCart,
}: MobileDetailsModalProps) {
  // Keep track of which gallery image is currently selected
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  if (!mobile) return null;

  const activeImage = mobile.images[selectedImageIndex] || mobile.thumbnail;

  const fullSpecsList = [
    { label: "تراشه و پردازنده", value: mobile.specs.processor, icon: <Cpu className="w-4 h-4 text-sky-400" /> },
    { label: "حافظه رم (RAM)", value: `${mobile.specs.ramGb} گیگابایت`, icon: <Layers className="w-4 h-4 text-amber-400" /> },
    { label: "حافظه داخلی", value: `${mobile.specs.storageGb} گیگابایت`, icon: <HardDrive className="w-4 h-4 text-rose-400" /> },
    { label: "ابعاد و نرخ نوسازی نمایشگر", value: `${mobile.specs.displaySizeInch} اینچ (${mobile.specs.refreshRateHz}Hz)`, icon: <Smartphone className="w-4 h-4 text-sky-400" /> },
    { label: "رزولوشن دوربین اصلی", value: `${mobile.specs.cameraMp} مگاپیکسل`, icon: <Camera className="w-4 h-4 text-amber-400" /> },
    { label: "ظرفیت باتری", value: `${mobile.specs.batteryMah} میلی‌آمپر ساعت`, icon: <BatteryCharging className="w-4 h-4 text-emerald-400" /> },
    { label: "سیستم‌عامل", value: mobile.specs.os, icon: <ShieldCheck className="w-4 h-4 text-rose-400" /> },
    { label: "شبکه ارتباطی", value: mobile.specs.is5G ? "پشتیبانی کامل از 5G" : "4G LTE", icon: <Wifi className="w-4 h-4 text-sky-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1120] border border-white/15 p-6 md:p-8 shadow-2xl">
        {/* Close Modal Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Right Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full h-72 md:h-80 rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 flex items-center justify-center p-6">
              <Image
                src={activeImage}
                alt={mobile.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />
            </div>

            {/* Thumbnail Switcher */}
            {mobile.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {mobile.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-amber-400 bg-white/10 scale-105"
                        : "border-white/10 bg-white/5 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={imgUrl} alt="" fill sizes="64px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Left Column: Full Details & Specs */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  برند {mobile.brand}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  امتیاز {mobile.rating} از ۵
                </span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  موجودی انبار: {mobile.stock} عدد
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">{mobile.title}</h2>
              <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                {mobile.description}
              </p>
            </div>

            {/* Complete Hardware Specifications List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400">جدول کامل مشخصات فنی:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {fullSpecsList.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="p-2 rounded-lg bg-white/5">{spec.icon}</div>
                    <div>
                      <p className="text-[11px] text-slate-400">{spec.label}</p>
                      <p className="text-xs font-bold text-slate-100">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Add to Cart Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">قیمت با احتساب تخفیف ویژه:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 line-through">${mobile.price}</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
                    ${mobile.discountedPrice}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(mobile);
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 hover:opacity-95 transition-opacity shadow-lg cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}