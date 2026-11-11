"use client";

import React from "react";
import {
  Store,
  ShoppingBag,
  Wallet,
  User,
  Info,
  PhoneCall,
  Smartphone,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { BrandCategory } from "@/core/entities/mobile.entity";

// Define the available navigation views across the application
export type ActiveTab = "store" | "cart" | "wallet" | "account" | "about" | "contact";

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  selectedCategory: BrandCategory;
  onSelectCategory: (category: BrandCategory) => void;
  cartCount: number;
  walletBalance: number;
}

const CATEGORIES: { id: BrandCategory; label: string }[] = [
  { id: "All", label: "همه برندها" },
  { id: "Apple", label: "اپل (Apple)" },
  { id: "Samsung", label: "سامسونگ (Samsung)" },
  { id: "Oppo", label: "اوپو (Oppo)" },
  { id: "Realme", label: "ریلمی (Realme)" },
  { id: "Vivo", label: "ویوو (Vivo)" },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  cartCount,
  walletBalance,
}: SidebarProps) {
  // Primary navigation items list
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "store", label: "ویترین فروشگاه", icon: <Store className="w-5 h-5" /> },
    {
      id: "cart",
      label: "سبد خرید من",
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: cartCount,
    },
    { id: "wallet", label: "کیف پول دیجیتال", icon: <Wallet className="w-5 h-5" /> },
    { id: "account", label: "حساب کاربری", icon: <User className="w-5 h-5" /> },
    { id: "about", label: "درباره ما", icon: <Info className="w-5 h-5" /> },
    { id: "contact", label: "ارتباط با ما", icon: <PhoneCall className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-6 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-5 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-400 p-[2px]">
            <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-white via-sky-200 to-amber-300 bg-clip-text text-transparent">
              لومینیکس موبایل
            </h1>
            <p className="text-xs text-slate-400">مرجع تخصصی پرچمداران</p>
          </div>
        </div>

        {/* User Mini Profile & Quick Wallet Card */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-500/15 via-rose-500/10 to-amber-400/15 border border-white/15 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              کاربر ویژه
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              سطح طلایی
            </span>
          </div>
          <div className="pt-1 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">موجودی کیف پول:</span>
            <span className="text-sm font-bold text-amber-300">
              ${walletBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 px-2 mb-2">بخش‌های سایت</p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500/25 via-rose-500/20 to-amber-400/20 text-white border border-sky-400/40 shadow-lg shadow-sky-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-amber-400" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Brand Categories Section (Distinct from Advanced Spec Filters) */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              دسته‌بندی برندها
            </p>
            <span className="text-[10px] text-slate-500">Category</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id && activeTab === "store";
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onSelectTab("store");
                  }}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-white/15 text-amber-300 border border-amber-400/40"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}