import { useEffect, useRef } from "react";

export function useCarousel(intervalMs: number = 3000, scrollOffset: number = 16) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current) return;
    
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      if (carouselRef.current) {
        const scrollLeft = carouselRef.current.scrollLeft;
        const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        
        // Find the width of the first child element to use as the base scroll amount
        const childElement = carouselRef.current.firstElementChild as HTMLElement;
        const childWidth = childElement?.offsetWidth || 300;
        
        if (scrollLeft >= maxScrollLeft - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: childWidth + scrollOffset, behavior: 'smooth' });
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, scrollOffset]);

  return carouselRef;
}
