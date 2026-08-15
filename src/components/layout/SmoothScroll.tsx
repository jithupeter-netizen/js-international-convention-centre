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
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger when the page height changes (e.g. images load, accordions open)
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);
    
    // Fallback refresh after initial render
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1500);

    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [isFullyLoaded, isBot]);

  return <>{children}</>;
}
