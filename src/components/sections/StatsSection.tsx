"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";

const stats = [
  { value: 1200, suffix: "+", label: "Guest Auditorium" },
  { value: 700, suffix: "+", label: "Dining Capacity" },
  { value: 500, suffix: "+", label: "Car Parking" },
  { value: 10, suffix: "", label: "Luxury Suites" },
  { value: 3, suffix: "", label: "Green Rooms" },
  { value: 100, suffix: "+", label: "Dormitory accommodation" },
];

export default function StatsSection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const sectionRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade in the container
      gsap.fromTo(
        ".stat-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
        }
      );

      // Animate the numbers counting up
      numbersRef.current.forEach((el, index) => {
        if (!el) return;
        const targetValue = stats[index].value;
        
        gsap.to(el, {
          innerHTML: targetValue,
          duration: 2,
          snap: { innerHTML: 1 }, // Snap to whole numbers
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isFullyLoaded, isBot]);

  return (
    <section ref={sectionRef} className="py-24 bg-luxury-cream text-luxury-dark relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 divide-x-0 lg:divide-x divide-luxury-taupe">
          
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-item opacity-0 flex flex-col items-center justify-center text-center lg:px-4"
            >
              <div className="flex items-baseline mb-2 text-luxury-dark">
                <span 
                  ref={(el) => {
                    numbersRef.current[index] = el;
                  }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                >
                  0
                </span>
                <span className="text-3xl md:text-4xl font-bold ml-1 text-luxury-gold">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm md:text-base font-medium text-luxury-mauve uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
