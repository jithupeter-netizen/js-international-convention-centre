import { useState, useEffect, useRef } from "react";

export function useInView(margin = "0px", triggerOnce = true) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(el); // Only trigger once
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { rootMargin: margin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [margin]);

  return { ref, isInView };
}
