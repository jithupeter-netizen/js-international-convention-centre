"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PreloaderContextType {
  progress: number;
  isFullyLoaded: boolean;
  isBot: boolean;
  stage3Butterfly: boolean;
  stage4Audio: boolean;
}

const PreloaderContext = createContext<PreloaderContextType>({
  progress: 0,
  isFullyLoaded: false,
  isBot: false,
  stage3Butterfly: false,
  stage4Audio: false,
});

export const usePreloader = () => useContext(PreloaderContext);

export const PreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [stage3Butterfly, setStage3Butterfly] = useState(false);
  const [stage4Audio, setStage4Audio] = useState(false);
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    // 1. Bot Detection
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const botPatterns = /bot|crawler|spider|crawling|lighthouse|speed-insights|chrome-lighthouse|googlebot/i;
    
    if (botPatterns.test(userAgent)) {
      setIsBot(true);
      setProgress(100);
      setIsFullyLoaded(true);
      return;
    }

    setProgress(100);

    setIsFullyLoaded(true);

    const handleInitialInteractionOrScroll = () => {
      setStage3Butterfly(true);
      setStage4Audio(true);
    };

    if (typeof window !== 'undefined') {
      if (window.scrollY > 20) {
        handleInitialInteractionOrScroll();
      } else {
        const onScrollOrTouch = () => {
          handleInitialInteractionOrScroll();
          window.removeEventListener('scroll', onScrollOrTouch);
          window.removeEventListener('touchstart', onScrollOrTouch);
          window.removeEventListener('mousemove', onScrollOrTouch);
        };
        window.addEventListener('scroll', onScrollOrTouch, { passive: true });
        window.addEventListener('touchstart', onScrollOrTouch, { passive: true });
        window.addEventListener('mousemove', onScrollOrTouch, { passive: true });

        return () => {
          window.removeEventListener('scroll', onScrollOrTouch);
          window.removeEventListener('touchstart', onScrollOrTouch);
          window.removeEventListener('mousemove', onScrollOrTouch);
        };
      }
    }
  }, []);

  return (
    <PreloaderContext.Provider value={{ progress, isFullyLoaded, isBot, stage3Butterfly, stage4Audio }}>
      {children}
    </PreloaderContext.Provider>
  );
};
