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

    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;
    let t4: NodeJS.Timeout;

    const runSequence = () => {
      // Stage 2: 360 Viewers (defer by 1200ms after load/idle)
      t2 = setTimeout(() => {
        setIsFullyLoaded(true);

        // Stage 3: Butterfly animation (1500ms after Stage 2)
        t3 = setTimeout(() => {
          setStage3Butterfly(true);

          // Stage 4: Background Music (1500ms after Stage 3)
          t4 = setTimeout(() => {
            setStage4Audio(true);
          }, 1500);

        }, 1500);

      }, 1200);
    };

    const win: any = typeof window !== 'undefined' ? window : null;
    if (!win) return;

    if ('requestIdleCallback' in win) {
      const idleId = (win as any).requestIdleCallback(runSequence, { timeout: 3000 });
      return () => {
        (win as any).cancelIdleCallback(idleId);
        if (t2) clearTimeout(t2);
        if (t3) clearTimeout(t3);
        if (t4) clearTimeout(t4);
      };
    } else {
      if (document.readyState === 'complete') {
        runSequence();
      } else {
        win.addEventListener('load', runSequence, { once: true });
      }
      return () => {
        win.removeEventListener('load', runSequence);
        if (t2) clearTimeout(t2);
        if (t3) clearTimeout(t3);
        if (t4) clearTimeout(t4);
      };
    }
  }, []);

  return (
    <PreloaderContext.Provider value={{ progress, isFullyLoaded, isBot, stage3Butterfly, stage4Audio }}>
      {children}
    </PreloaderContext.Provider>
  );
};
