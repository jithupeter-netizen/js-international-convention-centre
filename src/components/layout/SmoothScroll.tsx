"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const { isFullyLoaded, isBot } = usePreloader();

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Bypass Lenis on mobile/touch devices to save CPU and use native scrolling
    const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                     window.matchMedia("(pointer: coarse)").matches;
                     
    if (isMobile) {
      const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
      return () => clearTimeout(timer);
    }

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Synchronize Lenis scrolling with GSAP ScrollTrigger
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(updateRaf);

    // Initial ScrollTrigger refresh after layout stabilizes
    const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
    };
  }, [isFullyLoaded, isBot]);

  return <>{children}</>;
}
