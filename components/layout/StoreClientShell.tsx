"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  User,
  Info,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight,
} from "lucide-react";
import {
  MobileProduct,
  MobileFilterCriteria,
  CartState,
  BrandCategory,
} from "@/core/entities/mobile.entity";
import {
  GetFilteredMobilesQuery,
  GetRandomShowcaseQuery,
  MobileQueryHandler,
} from "@/application/queries/mobile.queries";
import { CartCommand, CartCommandHandler } from "@/application/commands/cart.commands";
import Sidebar, { ActiveTab } from "./Sidebar";
import AnimatedSearchBar from "./AnimatedSearchBar";
import MobileCard from "../mobile/MobileCard";
import FilterPanel from "../mobile/FilterPanel";
import MobileDetailsModal from "../mobile/MobileDetailsModal";
import ShoppingCartView from "../cart/ShoppingCartView";

interface StoreClientShellProps {
  initialMobiles: MobileProduct[];
  serverError: string | null;
}

const INITIAL_CART_STATE: CartState = {
  items: [],
  totalItemsCount: 0,
  totalOriginalPrice: 0,
  totalPayablePrice: 0,
};

export default function StoreClientShell({
  initialMobiles,
  serverError,
}: StoreClientShellProps) {
  // Active view state ("store" | "cart" | "wallet" | "account")
  const [activeTab, setActiveTab] = useState<ActiveTab>("store");
  const [selectedMobileForModal, setSelectedMobileForModal] = useState<MobileProduct | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(serverError ? { type: "error", message: serverError } : null);

  // User digital wallet balance
  const [walletBalance, setWalletBalance] = useState<number>(3500);

  // CQRS Read State: Filter Criteria
  const [filterCriteria, setFilterCriteria] = useState<MobileFilterCriteria>({
    searchQuery: "",
    category: "All",
    maxPrice: 2000,
    ramOptions: [],
    storageOptions: [],
    only5G: false,
    onlyInStock: false,
    sortBy: "rating-desc",
  });

  // CQRS Read State: Random Showcase Products on Homepage
  const [randomShowcase, setRandomShowcase] = useState<MobileProduct[]>([]);

  // CQRS Write State: Shopping Cart
  const [cartState, setCartState] = useState<CartState>(INITIAL_CART_STATE);

  // Helper to show temporary toast notifications
  const showToast = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Execute CQRS Random Showcase Query (runs on mount + every 12 seconds + manual click)
  const refreshRandomShowcase = useCallback(() => {
    const query = new GetRandomShowcaseQuery(3);
    const result = MobileQueryHandler.executeRandomShowcaseQuery(initialMobiles, query);
    if (result.isSuccess) {
      setRandomShowcase(result.data);
    }
  }, [initialMobiles]);

  useEffect(() => {
    refreshRandomShowcase();
    const interval = setInterval(refreshRandomShowcase, 12000);
    return () => clearInterval(interval);
  }, [refreshRandomShowcase]);

  // Execute CQRS Filtered Mobiles Query whenever criteria changes
  const filteredMobiles = useMemo(() => {
    const query = new GetFilteredMobilesQuery(filterCriteria);
    const result = MobileQueryHandler.executeFilterQuery(initialMobiles, query);
    if (!result.isSuccess) {
      return [];
    }
    return result.data;
  }, [initialMobiles, filterCriteria]);

  // Dispatch CQRS Cart Commands
  const handleDispatchCartCommand = useCallback(
    (command: CartCommand) => {
      const result = CartCommandHandler.execute(cartState, command);
      if (result.isSuccess) {
        setCartState(result.data);
        if (command.type === "ADD_ITEM") {
          showToast("success", `«${command.payload.product.title}» به سبد خرید اضافه شد.`);
        } else if (command.type === "REMOVE_SELECTED_ITEMS") {
          showToast("success", "کالاهای انتخاب‌شده از سبد خرید حذف شدند.");
        }
      } else {
        showToast("error", result.error.message);
      }
    },
    [cartState, showToast]
  );

  // Handle instant wallet checkout
  const handleCheckoutWithWallet = () => {
    if (cartState.totalPayablePrice > walletBalance) {
      showToast(
        "error",
        "موجودی کیف پول شما کافی نیست! لطفاً از بخش «کیف پول دیجیتال» حساب خود را شارژ کنید."
      );
      return;
    }
    setWalletBalance((prev) => prev - cartState.totalPayablePrice);
    handleDispatchCartCommand({ type: "CLEAR_CART" });
    showToast("success", "پرداخت با موفقیت انجام شد! سفارش شما ثبت گردید.");
  };

  // Smoothly scroll to About Us or Contact Us at the bottom of the storefront page
  const handleScrollToSection = (sectionId: "about-section" | "contact-section") => {
    if (activeTab !== "store") {
      setActiveTab("store");
      // Wait briefly for the storefront DOM to render before scrolling
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen pr-20">
      {/* Fixed Right Edge Hover-Expandable Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onScrollToSection={handleScrollToSection}
        selectedCategory={filterCriteria.category ?? "All"}
        onSelectCategory={(category: BrandCategory) =>
          setFilterCriteria((prev) => ({ ...prev, category }))
        }
        cartCount={cartState.totalItemsCount}
        walletBalance={walletBalance}
      />

      {/* Floating Error / Success Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all ${
            notification.type === "error"
              ? "bg-rose-950/90 border-rose-500/50 text-rose-200"
              : "bg-slate-900/95 border-amber-400/50 text-amber-300"
          }`}
        >
          {notification.type === "error" ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs md:text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ========================================================= */}
        {/* VIEW 1: MAIN STOREFRONT (Search + Random Showcase + Grid) */}
        {/* ========================================================= */}
        {activeTab === "store" && (
          <div className="space-y-8">
            {/* Storefront Hero & Animated Search Bar (ONLY visible in store tab) */}
            <div className="rounded-3xl bg-gradient-to-br from-sky-500/10 via-rose-500/10 to-amber-400/10 backdrop-blur-2xl border border-white/10 p-6 md:p-10 space-y-6 shadow-2xl">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  جشنواره فروش ویژه پرچمداران با ضمانت رجیستری
                </span>
                <h2 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-white via-sky-200 to-amber-300 bg-clip-text text-transparent">
                  بررسی، مقایسه و خرید آنلاین جدیدترین گوشی‌های بازار
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  تمامی دستگاه‌ها با گارانتی ۱۸ ماهه معتبر شرکتی، تضمین اصالت کالا و ارسال اکسپرس به سراسر کشور عرضه می‌شوند.
                </p>
              </div>

              <AnimatedSearchBar
                value={filterCriteria.searchQuery ?? ""}
                onChange={(newQuery) =>
                  setFilterCriteria((prev) => ({ ...prev, searchQuery: newQuery }))
                }
                resultsCount={filteredMobiles.length}
              />
            </div>

            {/* Dynamic Random Showcase Section on Homepage */}
            {randomShowcase.length > 0 && !filterCriteria.searchQuery && (
              <section className="rounded-3xl bg-gradient-to-r from-amber-400/10 via-rose-500/10 to-sky-500/10 border border-amber-400/25 p-5 md:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">
                        پیشنهادهای شگفت‌انگیز لحظه‌ای
                      </h3>
                      <p className="text-xs text-slate-400">
                        منتخبی از محبوب‌ترین مدل‌های فروشگاه با تخفیف ویژه
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={refreshRandomShowcase}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    نمایش پیشنهادهای دیگر
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {randomShowcase.map((mobile) => (
                    <MobileCard
                      key={`random-${mobile.id}`}
                      mobile={mobile}
                      onAddToCart={(product) =>
                        handleDispatchCartCommand({
                          type: "ADD_ITEM",
                          payload: { product },
                        })
                      }
                      onSelectForDetails={setSelectedMobileForModal}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Advanced Spec & Price Filter Panel */}
            <FilterPanel
              criteria={filterCriteria}
              onChangeCriteria={setFilterCriteria}
              onResetFilters={() =>
                setFilterCriteria({
                  searchQuery: "",
                  category: "All",
                  maxPrice: 2000,
                  ramOptions: [],
                  storageOptions: [],
                  only5G: false,
                  onlyInStock: false,
                  sortBy: "rating-desc",
                })
              }
            />

            {/* Main Filtered Products Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-white">
                  ویترین محصولات{" "}
                  <span className="text-sm font-normal text-sky-400">
                    ({filteredMobiles.length} مدل فعال)
                  </span>
                </h3>
                <span className="text-xs text-slate-400">
                  برند انتخابی:{" "}
                  <strong className="text-amber-300">
                    {filterCriteria.category === "All"
                      ? "همه برندها"
                      : filterCriteria.category}
                  </strong>
                </span>
              </div>

              {filteredMobiles.length === 0 ? (
                <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-12 text-center space-y-3">
                  <p className="text-base font-bold text-slate-200">
                    هیچ موبایلی با این مشخصات و فیلترها پیدا نشد!
                  </p>
                  <p className="text-xs text-slate-400">
                    پیشنهاد می‌کنیم سقف بودجه را افزایش دهید یا بعضی از فیلترهای رم و حافظه را بردارید.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredMobiles.map((mobile) => (
                    <MobileCard
                      key={mobile.id}
                      mobile={mobile}
                      onAddToCart={(product) =>
                        handleDispatchCartCommand({
                          type: "ADD_ITEM",
                          payload: { product },
                        })
                      }
                      onSelectForDetails={setSelectedMobileForModal}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ========================================================= */}
            {/* BOTTOM SECTIONS: ABOUT US & CONTACT US (Free at the end)  */}
            {/* ========================================================= */}
            <div className="pt-12 border-t border-white/10 space-y-8">
              {/* About Us Section */}
              <section
                id="about-section"
                className="scroll-mt-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-5 leading-relaxed"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30">
                    <Info className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">درباره فروشگاه موبایل‌پلاس</h2>
                    <p className="text-xs text-slate-400">مرجع تخصصی نقد، بررسی و فروش مستقیم گوشی‌های هوشمند</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-7">
                  فروشگاه اینترنتی <strong>موبایل‌پلاس</strong> با هدف ایجاد تجربه‌ای شفاف، سریع و مطمئن در خرید گوشی‌های هوشمند راه‌اندازی شده است. ما با حذف واسطه‌ها و تأمین مستقیم کالا از واردکنندگان رسمی، جدیدترین پرچمداران و میان‌رده‌های بازار جهانی را با قیمت رقابتی، کد فعال‌سازی (رجیستری قانونی) و ضمانت معتبر در اختیار خریداران قرار می‌دهیم.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#070b14]/60 border border-white/5 space-y-1.5">
                    <ShieldCheck className="w-6 h-6 text-sky-400" />
                    <h3 className="font-bold text-sm text-white">ضمانت اصالت و رجیستری</h3>
                    <p className="text-xs text-slate-400">
                      تمامی گوشی‌ها پلمپ شرکتی بوده و با گارانتی ۱۸ ماهه رسمی و کد همتا عرضه می‌شوند.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#070b14]/60 border border-white/5 space-y-1.5">
                    <Truck className="w-6 h-6 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">ارسال اکسپرس و بیمه‌شده</h3>
                    <p className="text-xs text-slate-400">
                      ارسال ۳ ساعته در تهران و ارسال پیشتاز به همراه بیمه کامل مرسوله به سراسر ایران.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#070b14]/60 border border-white/5 space-y-1.5">
                    <Headphones className="w-6 h-6 text-rose-400" />
                    <h3 className="font-bold text-sm text-white">مشاوره تخصصی پیش از خرید</h3>
                    <p className="text-xs text-slate-400">
                      تیم فنی ما آماده راهنمایی شما برای انتخاب بهترین گوشی متناسب با بودجه و نیازتان است.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Us Section */}
              <section
                id="contact-section"
                className="scroll-mt-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30">
                    <PhoneCall className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">ارتباط با ما و پشتیبانی مشتریان</h2>
                    <p className="text-xs text-slate-400">پاسخگویی و پیگیری سفارش‌ها در ۷ روز هفته (ساعت ۹ الی ۲۲)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#070b14]/60 border border-white/5">
                    <PhoneCall className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block mb-0.5">تلفن امور مشتریان:</span>
                      <strong className="text-white text-base">۰۲۱-۸۸۹۹۰۰۱۱</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#070b14]/60 border border-white/5">
                    <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block mb-0.5">ایمیل سازمانی و پیگیری:</span>
                      <strong className="text-white">info@mobileplus-shop.ir</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#070b14]/60 border border-white/5">
                    <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block mb-0.5">نشانی دفتر مرکزی و تحویل حضوری:</span>
                      <strong className="text-white">تهران، خیابان ولیعصر، برج فناوری، طبقه ۴</strong>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SHOPPING CART (Clean dedicated view, NO search)   */}
        {/* ========================================================= */}
        {activeTab === "cart" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl bg-white/[0.04] border border-white/10 p-5">
              <div>
                <h2 className="text-xl font-black text-white">سبد خرید شما</h2>
                <p className="text-xs text-slate-400">مدیریت کالاهای انتخابی و تسویه‌حساب نهایی</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("store")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-sky-300 border border-white/10 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                ادامه خرید در فروشگاه
              </button>
            </div>

            <ShoppingCartView
              cartState={cartState}
              walletBalance={walletBalance}
              onDispatchCommand={handleDispatchCartCommand}
              onCheckoutWithWallet={handleCheckoutWithWallet}
              onBackToStore={() => setActiveTab("store")}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: DIGITAL WALLET (Clean dedicated view, NO search)  */}
        {/* ========================================================= */}
        {activeTab === "wallet" && (
          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-7 h-7 text-amber-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">کیف پول دیجیتال</h2>
                  <p className="text-xs text-slate-400">
                    افزایش موجودی آنی برای خرید سریع‌تر موبایل‌های فروشگاه
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("store")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-slate-200 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به فروشگاه
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/20 via-rose-500/15 to-amber-400/20 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-300 block">موجودی قابل استفاده:</span>
                <span className="text-3xl font-black text-amber-300">
                  ${walletBalance.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[500, 1000, 2500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setWalletBalance((prev) => prev + amount);
                      showToast("success", `مبلغ $${amount} به کیف پول شما اضافه شد.`);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/15 transition-all cursor-pointer"
                  >
                    + افزایش اعتبار ${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: USER ACCOUNT (Clean dedicated view, NO search)    */}
        {/* ========================================================= */}
        {activeTab === "account" && (
          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <User className="w-7 h-7 text-sky-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">حساب کاربری من</h2>
                  <p className="text-xs text-slate-400">مشخصات خریدار و وضعیت اشتراک</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("store")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-slate-200 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به فروشگاه
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-[#070b14]/60 border border-white/5 space-y-1">
                <span className="text-xs text-slate-400">وضعیت حساب:</span>
                <p className="font-bold text-white">کاربر تاییدشده (احراز هویت کامل)</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#070b14]/60 border border-white/5 space-y-1">
                <span className="text-xs text-slate-400">سطح باشگاه مشتریان:</span>
                <p className="font-bold text-amber-300">اشتراک طلایی (ارسال اکسپرس رایگان)</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#070b14]/60 border border-white/5 space-y-1">
                <span className="text-xs text-slate-400">تعداد کالاهای در انتظار پرداخت:</span>
                <p className="font-bold text-sky-400">{cartState.totalItemsCount} دستگاه در سبد خرید</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Full Details Modal */}
      <MobileDetailsModal
        mobile={selectedMobileForModal}
        onClose={() => setSelectedMobileForModal(null)}
        onAddToCart={(product) =>
          handleDispatchCartCommand({ type: "ADD_ITEM", payload: { product } })
        }
      />
    </div>
  );
}