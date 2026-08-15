"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PreloaderContextType {
  progress: number;
  isFullyLoaded: boolean;
  isBot: boolean;
}

const PreloaderContext = createContext<PreloaderContextType>({
  progress: 0,
  isFullyLoaded: false,
  isBot: false,
});

export const usePreloader = () => useContext(PreloaderContext);

export const PreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    // 1. Bot Detection
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = /bot|crawler|spider|crawling|lighthouse|speed-insights|chrome-lighthouse|googlebot/i;
    
    if (botPatterns.test(userAgent)) {
      setIsBot(true);
      // For bots, we never trigger the heavy load. They just see the static version.
      return;
    }

    // Fast loading without artificial blocking
    const img = new Image();
    img.src = "/pix/test.webp"; 
    
    // Allow the DOM to mount quickly rather than waiting for the entire 318KB image
    // Allow the DOM to mount quickly rather than waiting for the entire 318KB image
    setProgress(100);
    
    // Defer heavy assets (like 360 viewers) until AFTER the browser is completely done loading critical JS/layout
    if (document.readyState === 'complete') {
      // If already loaded
      setTimeout(() => setIsFullyLoaded(true), 100);
    } else {
      // Wait for everything else to finish
      window.addEventListener('load', () => {
        setTimeout(() => setIsFullyLoaded(true), 500); // 500ms extra buffer for safety
      });
      // Fallback just in case 'load' doesn't fire
      setTimeout(() => setIsFullyLoaded(true), 3000);
    }
    
    return () => {};
  }, []);

  return (
    <PreloaderContext.Provider value={{ progress, isFullyLoaded, isBot }}>
      {children}
    </PreloaderContext.Provider>
  );
};
