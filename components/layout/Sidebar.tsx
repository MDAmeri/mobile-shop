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
  Layers,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { BrandCategory } from "@/core/entities/mobile.entity";

// Define main separate views (About and Contact are now smooth-scroll sections at the bottom)
export type ActiveTab = "store" | "cart" | "wallet" | "account";

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onScrollToSection: (sectionId: "about-section" | "contact-section") => void;
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
  onScrollToSection,
  selectedCategory,
  onSelectCategory,
  cartCount,
  walletBalance,
}: SidebarProps) {
  // Primary page navigation tabs
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    { id: "store", label: "ویترین فروشگاه", icon: <Store className="w-5 h-5 shrink-0" /> },
    {
      id: "cart",
      label: "سبد خرید من",
      icon: <ShoppingBag className="w-5 h-5 shrink-0" />,
      badge: cartCount,
    },
    { id: "wallet", label: "کیف پول دیجیتال", icon: <Wallet className="w-5 h-5 shrink-0" /> },
    { id: "account", label: "حساب کاربری", icon: <User className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <aside
      aria-label="منوی اصلی سایت"
      className="group fixed top-0 right-0 z-40 h-screen w-20 hover:w-72 bg-[#080d1a]/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 ease-in-out flex flex-col justify-between overflow-y-auto overflow-x-hidden py-5 px-3"
    >
      <div className="space-y-6">
        {/* Store Brand Logo (Always visible icon, text reveals on hover) */}
        <div className="flex items-center gap-3.5 px-1.5 pb-4 border-b border-white/10">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-400 p-[2px] shadow-lg shadow-sky-500/10">
            <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            <h1 className="text-base font-black bg-gradient-to-r from-white via-sky-200 to-amber-300 bg-clip-text text-transparent">
              موبایل‌پلاس
            </h1>
            <p className="text-[11px] text-slate-400">فروشگاه تخصصی کالای دیجیتال</p>
          </div>
        </div>

        {/* User Wallet Quick Status (Expands smoothly on hover) */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-500/15 via-rose-500/10 to-amber-400/15 border border-white/10 p-3 transition-all duration-300">
          {/* Collapsed view: only wallet icon */}
          <div className="flex items-center justify-center group-hover:hidden">
            <Wallet className="w-5 h-5 text-amber-300" />
          </div>

          {/* Expanded view on hover: full balance details */}
          <div className="hidden group-hover:block space-y-2.5 whitespace-nowrap">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                مشتری ویژه
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                اشتراک طلایی
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">موجودی کیف پول:</span>
              <span className="text-sm font-bold text-amber-300">
                ${walletBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500 px-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            دسترسی سریع
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`relative w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500/25 via-rose-500/20 to-amber-400/20 text-white border border-sky-400/40 shadow-lg shadow-sky-500/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={isActive ? "text-amber-400" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>

                {/* Cart Badge: Works in both collapsed and expanded states */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1.5 left-1.5 group-hover:static px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Brand Categories (Reveals inside the drawer when hovered) */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3.5 px-4 py-1 text-slate-400">
            <Layers className="w-5 h-5 text-sky-400 shrink-0" />
            <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              دسته‌بندی برندها
            </span>
          </div>

          <div className="hidden group-hover:flex flex-col gap-1 pr-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id && activeTab === "store";
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onSelectTab("store");
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-white/15 text-amber-300 border border-amber-400/40"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Links: Smooth Scroll to About Us & Contact Us */}
      <div className="pt-4 border-t border-white/10 space-y-1.5">
        <button
          type="button"
          onClick={() => onScrollToSection("about-section")}
          title="درباره ما"
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-rose-300 transition-all cursor-pointer"
        >
          <Info className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            درباره فروشگاه ما
          </span>
        </button>

        <button
          type="button"
          onClick={() => onScrollToSection("contact-section")}
          title="ارتباط با ما"
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-sky-300 transition-all cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 text-sky-400 shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            ارتباط با پشتیبانی
          </span>
        </button>
      </div>
    </aside>
  );
}