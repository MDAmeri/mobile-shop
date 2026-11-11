"use client";

import React from "react";
import Image from "next/image";
import {
  Cpu,
  HardDrive,
  BatteryCharging,
  Camera,
  ShoppingCart,
  Eye,
  Star,
  Wifi,
} from "lucide-react";
import { MobileProduct } from "@/core/entities/mobile.entity";

interface MobileCardProps {
  mobile: MobileProduct;
  onAddToCart: (product: MobileProduct) => void;
  onSelectForDetails: (product: MobileProduct) => void;
}

export default function MobileCard({
  mobile,
  onAddToCart,
  onSelectForDetails,
}: MobileCardProps) {
  return (
    <div className="group relative rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:border-sky-400/40 p-4 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-sky-500/10">
      {/* Top badges: Brand, 5G support, and Discount percentage */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-400/20">
              {mobile.brand}
            </span>
            {mobile.specs.is5G && (
              <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/25 flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                5G
              </span>
            )}
          </div>

          {mobile.discountPercentage > 0 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {Math.round(mobile.discountPercentage)}% تخفیف
            </span>
          )}
        </div>

        {/* Product Image Container with subtle hover zoom */}
        <div
          onClick={() => onSelectForDetails(mobile)}
          className="relative w-full h-48 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent mb-4 overflow-hidden cursor-pointer flex items-center justify-center p-4"
        >
          <Image
            src={mobile.thumbnail}
            alt={mobile.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3
            onClick={() => onSelectForDetails(mobile)}
            className="font-bold text-base text-white group-hover:text-sky-300 transition-colors cursor-pointer line-clamp-1"
          >
            {mobile.title}
          </h3>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold shrink-0 bg-amber-400/10 px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{mobile.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Hardware Specifications Quick Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#070b14]/60 border border-white/5 text-xs text-slate-300 mb-4">
          <div className="flex items-center gap-1.5 truncate" title={mobile.specs.processor}>
            <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{mobile.specs.processor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {mobile.specs.ramGb}GB / {mobile.specs.storageGb}GB
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>دوربین {mobile.specs.cameraMp}MP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{mobile.specs.batteryMah} mAh</span>
          </div>
        </div>
      </div>

      {/* Bottom Price & Action Buttons */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-400">قیمت نهایی خرید:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 line-through">${mobile.price}</span>
            <span className="text-lg font-black bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
              ${mobile.discountedPrice}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(mobile)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 hover:opacity-95 transition-opacity shadow-md cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            افزودن به سبد
          </button>

          <button
            type="button"
            onClick={() => onSelectForDetails(mobile)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            title="مشاهده تمام مشخصات فنی"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}