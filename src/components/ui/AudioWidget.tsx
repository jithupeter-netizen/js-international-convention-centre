"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { usePreloader } from "@/context/PreloaderContext";
import { useEffect, useState } from "react";

export default function AudioWidget() {
  const { isPlaying, toggleAudio } = useAudio();
  const { isFullyLoaded } = usePreloader();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isFullyLoaded) return null;

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-luxury-dark text-luxury-light rounded-full shadow-2xl flex items-center justify-center border border-luxury-taupe/30 hover:scale-110 active:scale-95 transition-transform group"
      aria-label="Toggle Music"
    >
      {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      
      {/* Tooltip */}
      <span className="absolute left-14 bg-luxury-dark/90 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {isPlaying ? "Music Off" : "Music On"}
      </span>
    </button>
  );
}
