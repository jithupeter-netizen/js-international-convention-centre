"use client";

import React from "react";
import { usePreloader } from "@/context/PreloaderContext";

export default function LoadingIndicator() {
  const { progress, isFullyLoaded, isBot } = usePreloader();

  if (isBot || isFullyLoaded) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 bg-luxury-light/80 backdrop-blur-md p-4 rounded-xl border border-luxury-taupe shadow-2xl transition-opacity duration-500">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-luxury-taupe/20 border-t-luxury-dark rounded-full animate-spin" />
        <span className="text-luxury-dark/90 text-sm font-medium tracking-wide">
          Loading 360° Experience
        </span>
        <span className="text-luxury-dark font-bold text-sm min-w-[3ch] text-right">
          {progress}%
        </span>
      </div>
      <div className="w-full h-1 bg-luxury-taupe/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-luxury-dark transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
