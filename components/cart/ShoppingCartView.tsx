"use client";

import React from "react";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckSquare,
  Square,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { CartState } from "@/core/entities/mobile.entity";
import { CartCommand } from "@/application/commands/cart.commands";

interface ShoppingCartViewProps {
  cartState: CartState;
  walletBalance: number;
  onDispatchCommand: (command: CartCommand) => void;
  onCheckoutWithWallet: () => void;
  onBackToStore: () => void;
}

export default function ShoppingCartView({
  cartState,
  walletBalance,
  onDispatchCommand,
  onCheckoutWithWallet,
  onBackToStore,
}: ShoppingCartViewProps) {
  // Count how many items are currently checked for bulk deletion
  const selectedForRemovalCount = cartState.items.filter(
    (item) => item.selectedForRemoval
  ).length;

  const totalDiscountSaved = cartState.totalOriginalPrice - cartState.totalPayablePrice;

  if (cartState.items.length === 0) {
    return (
      <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-12 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 text-sky-400" />
        </div>
        <h2 className="text-xl font-bold text-white">سبد خرید شما در حال حاضر خالی است</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          می‌توانید از ویترین فروشگاه، گوشی‌های هوشمند مورد نظر خود را بررسی و به سبد خرید اضافه کنید.
        </p>
        <button
          type="button"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به ویترین فروشگاه
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      {/* Cart Items List (2 Columns on large screens) */}
      <div className="xl:col-span-2 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 md:p-6 space-y-4">
        {/* Top Action Bar for Bulk Removal & Clear Cart */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">
              کالاهای موجود در سبد ({cartState.totalItemsCount} عدد)
            </h2>
            <p className="text-xs text-slate-400">
              برای حذف همزمان چند کالا، تیک کنار آن‌ها را فعال کنید
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedForRemovalCount > 0 && (
              <button
                type="button"
                onClick={() => onDispatchCommand({ type: "REMOVE_SELECTED_ITEMS" })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                حذف انتخاب‌شده‌ها ({selectedForRemovalCount})
              </button>
            )}

            <button
              type="button"
              onClick={() => onDispatchCommand({ type: "CLEAR_CART" })}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
            >
              خالی کردن کل سبد
            </button>
          </div>
        </div>

        {/* Individual Cart Rows */}
        <div className="space-y-3">
          {cartState.items.map((item) => (
            <div
              key={item.product.id}
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                item.selectedForRemoval
                  ? "bg-rose-500/10 border-rose-500/40"
                  : "bg-[#070b14]/60 border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Multi-select Checkbox for CQRS Bulk Removal */}
                <button
                  type="button"
                  onClick={() =>
                    onDispatchCommand({
                      type: "TOGGLE_SELECT_FOR_REMOVAL",
                      payload: { productId: item.product.id },
                    })
                  }
                  className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="انتخاب برای حذف گروهی"
                >
                  {item.selectedForRemoval ? (
                    <CheckSquare className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="relative w-16 h-16 rounded-xl bg-white/5 p-2 shrink-0">
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-sm md:text-base text-white">
                    {item.product.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {item.product.brand} • {item.product.specs.ramGb}GB RAM /{" "}
                    {item.product.specs.storageGb}GB
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 line-through">
                      ${item.product.price}
                    </span>
                    <span className="text-sm font-bold text-amber-300">
                      ${item.product.discountedPrice} (هر عدد)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Single Item Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() =>
                      onDispatchCommand({
                        type: "UPDATE_QUANTITY",
                        payload: {
                          productId: item.product.id,
                          quantity: item.quantity + 1,
                        },
                      })
                    }
                    className="p-1.5 rounded-lg hover:bg-white/10 text-sky-400 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onDispatchCommand({
                        type: "UPDATE_QUANTITY",
                        payload: {
                          productId: item.product.id,
                          quantity: item.quantity - 1,
                        },
                      })
                    }
                    className="p-1.5 rounded-lg hover:bg-white/10 text-amber-400 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-left min-w-[70px]">
                  <span className="text-xs text-slate-400 block">جمع ردیف:</span>
                  <span className="text-sm font-black text-white">
                    ${item.product.discountedPrice * item.quantity}
                  </span>
                </div>

                {/* Single Item Remove Button */}
                <button
                  type="button"
                  onClick={() =>
                    onDispatchCommand({
                      type: "REMOVE_SINGLE_ITEM",
                      payload: { productId: item.product.id },
                    })
                  }
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                  title="حذف این کالا از سبد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary & Checkout Box */}
      <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 space-y-5 sticky top-6">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
          خلاصه صورت‌حساب
        </h3>

        <div className="space-y-3 text-xs md:text-sm">
          <div className="flex justify-between text-slate-300">
            <span>قیمت کل کالاها (بدون تخفیف):</span>
            <span>${cartState.totalOriginalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-emerald-400 font-medium">
            <span>سود شما از تخفیف ویژه:</span>
            <span>-${totalDiscountSaved.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>موجودی فعلی کیف پول شما:</span>
            <span className="text-sky-400 font-bold">
              ${walletBalance.toLocaleString()}
            </span>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
            <span className="font-bold text-white">مبلغ نهایی قابل پرداخت:</span>
            <span className="text-2xl font-black bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
              ${cartState.totalPayablePrice.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCheckoutWithWallet}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 hover:opacity-95 transition-opacity shadow-xl cursor-pointer"
        >
          <CreditCard className="w-5 h-5" />
          پرداخت آنی با کیف پول
        </button>
      </div>
    </div>
  );
}