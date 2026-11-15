"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Wifi, Check } from "lucide-react";
import { MobileFilterCriteria } from "@/core/entities/mobile.entity";

interface FilterPanelProps {
  criteria: MobileFilterCriteria;
  onChangeCriteria: (updated: MobileFilterCriteria) => void;
  onResetFilters: () => void;
}

const RAM_OPTIONS = [4, 6, 8, 12, 16];
const STORAGE_OPTIONS = [64, 128, 256, 512, 1024];

export default function FilterPanel({
  criteria,
  onChangeCriteria,
  onResetFilters,
}: FilterPanelProps) {
  // Toggle a numeric value inside an array filter (used for RAM and Storage multi-select)
  const toggleArrayFilter = (currentList: number[] = [], value: number): number[] => {
    return currentList.includes(value)
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];
  };

  return (
    <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 space-y-5 shadow-xl">
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm md:text-base font-bold text-white">
            فیلتر هوشمند مشخصات و قیمت
          </h2>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          حذف فیلترها
        </button>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* 1. Max Price Range Slider */}
        <div className="space-y-2 bg-[#070b14]/60 p-3.5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">سقف بودجه (قیمت):</span>
            <span className="font-bold text-amber-300">
              تا ${criteria.maxPrice ?? 2000}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={criteria.maxPrice ?? 2000}
            onChange={(e) =>
              onChangeCriteria({
                ...criteria,
                maxPrice: Number(e.target.value),
              })
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$100</span>
            <span>$1000</span>
            <span>$2000</span>
          </div>
        </div>

        {/* 2. RAM Multi-Select Chips */}
        <div className="space-y-2 bg-[#070b14]/60 p-3.5 rounded-2xl border border-white/5">
          <span className="text-xs text-slate-400 block">حافظه رم (RAM):</span>
          <div className="flex flex-wrap gap-1.5">
            {RAM_OPTIONS.map((ram) => {
              const isSelected = criteria.ramOptions?.includes(ram);
              return (
                <button
                  key={ram}
                  type="button"
                  onClick={() =>
                    onChangeCriteria({
                      ...criteria,
                      ramOptions: toggleArrayFilter(criteria.ramOptions, ram),
                    })
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {ram}GB
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Storage Multi-Select Chips */}
        <div className="space-y-2 bg-[#070b14]/60 p-3.5 rounded-2xl border border-white/5">
          <span className="text-xs text-slate-400 block">حافظه داخلی:</span>
          <div className="flex flex-wrap gap-1.5">
            {STORAGE_OPTIONS.map((storage) => {
              const isSelected = criteria.storageOptions?.includes(storage);
              return (
                <button
                  key={storage}
                  type="button"
                  onClick={() =>
                    onChangeCriteria({
                      ...criteria,
                      storageOptions: toggleArrayFilter(criteria.storageOptions, storage),
                    })
                  }
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {storage === 1024 ? "1TB" : `${storage}GB`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Sorting & Quick Toggles (5G / In Stock) */}
        <div className="space-y-2.5 bg-[#070b14]/60 p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <select
            value={criteria.sortBy ?? "rating-desc"}
            onChange={(e) =>
              onChangeCriteria({
                ...criteria,
                sortBy: e.target.value as MobileFilterCriteria["sortBy"],
              })
            }
            className="w-full bg-[#0b1120] text-xs text-slate-200 rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-sky-400"
          >
            <option value="rating-desc">مرتب‌سازی: بیشترین امتیاز</option>
            <option value="price-asc">مرتب‌سازی: ارزان‌ترین به گران‌ترین</option>
            <option value="price-desc">مرتب‌سازی: گران‌ترین به ارزان‌ترین</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onChangeCriteria({ ...criteria, only5G: !criteria.only5G })
              }
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                criteria.only5G
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              فقط 5G
            </button>

            <button
              type="button"
              onClick={() =>
                onChangeCriteria({
                  ...criteria,
                  onlyInStock: !criteria.onlyInStock,
                })
              }
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                criteria.onlyInStock
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              فقط موجود
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}