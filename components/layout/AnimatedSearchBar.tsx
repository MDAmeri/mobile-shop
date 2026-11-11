"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Sparkles } from "lucide-react";

interface AnimatedSearchBarProps {
  value: string;
  onChange: (newQuery: string) => void;
  resultsCount: number;
}

export default function AnimatedSearchBar({
  value,
  onChange,
  resultsCount,
}: AnimatedSearchBarProps) {
  // Local input value for immediate typing feedback
  const [localInput, setLocalInput] = useState<string>(value);
  // Track whether the search debounce is actively running
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Synchronize local input if parent resets filter externally
  useEffect(() => {
    setLocalInput(value);
  }, [value]);

  // Debounce search execution by 450ms to show the smooth animated border effect
  useEffect(() => {
    if (localInput === value) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      onChange(localInput);
      setIsSearching(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [localInput, value, onChange]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Outer wrapper that creates the 3px animated border thickness */}
      <div
        className={`relative rounded-2xl p-[3px] overflow-hidden transition-all duration-500 ${
          isSearching
            ? "shadow-[0_0_30px_-5px_rgba(56,189,248,0.45)] scale-[1.01]"
            : "bg-white/10 hover:bg-white/20"
        }`}
      >
        {/* Rotating conic-gradient layer (visible only around the 3px perimeter while searching) */}
        <div
          className={`absolute inset-[-150%] transition-opacity duration-300 ${
            isSearching ? "opacity-100 search-glow-ring" : "opacity-0"
          }`}
        />

        {/* Inner glassmorphic search container */}
        <div className="relative z-10 flex items-center gap-3 bg-[#0b1120]/95 backdrop-blur-xl rounded-[13px] px-4 py-3">
          <Search
            className={`w-5 h-5 transition-colors duration-300 ${
              isSearching ? "text-amber-400" : "text-sky-400"
            }`}
          />

          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="جست‌وجوی نام گوشی، برند (Apple, Samsung...) یا مدل پردازنده..."
            className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-400 focus:outline-none"
          />

          {/* Dynamic status badge inside the search bar */}
          {isSearching ? (
            <span className="text-xs font-medium bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 bg-clip-text text-transparent whitespace-nowrap animate-pulse">
              در حال کاوش...
            </span>
          ) : (
            localInput && (
              <span className="text-xs text-slate-400 whitespace-nowrap bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                {resultsCount} مدل یافت شد
              </span>
            )
          )}

          {/* Clear search button */}
          {localInput && (
            <button
              type="button"
              onClick={() => {
                setLocalInput("");
                onChange("");
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
              title="پاک کردن جست‌وجو"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subtle helper hint below search bar */}
      <div className="flex items-center justify-between px-2 mt-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          پیشنهاد جست‌وجو: <button onClick={() => setLocalInput("iPhone")} className="text-sky-400 hover:underline">iPhone</button>،{" "}
          <button onClick={() => setLocalInput("Snapdragon")} className="text-sky-400 hover:underline">Snapdragon</button>،{" "}
          <button onClick={() => setLocalInput("Samsung")} className="text-sky-400 hover:underline">Samsung</button>
        </span>
      </div>
    </div>
  );
}