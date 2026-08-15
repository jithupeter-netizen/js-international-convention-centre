"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";
import { useInView } from "@/hooks/useInView";
import { Camera } from "lucide-react";

const photos = [
  { src: "/Gallery/a (1).jpeg", alt: "Wedding Celebration", style: "col-span-2 row-span-2 aspect-square" },
  { src: "/Gallery/a (2).jpeg", alt: "Elegant Decor", style: "col-span-1 row-span-1 aspect-[4/3]" },
  { src: "/Gallery/a (3).jpeg", alt: "Grand Reception", style: "col-span-1 row-span-1 aspect-[4/3]" },
  { src: "/Gallery/a (4).jpeg", alt: "Beautiful Setup", style: "col-span-1 row-span-2 aspect-[3/4]" },
  { src: "/Gallery/a (5).jpeg", alt: "Ceremony Moments", style: "col-span-1 row-span-1 aspect-[4/3]" },
  { src: "/Gallery/a (6).jpeg", alt: "Stage Highlights", style: "col-span-2 row-span-1 aspect-[21/9]" },
  { src: "/Gallery/a (7).jpeg", alt: "Venue Ambiance", style: "col-span-1 row-span-1 aspect-square" },
  { src: "/Gallery/a (8).jpeg", alt: "Cherished Memories", style: "col-span-1 row-span-1 aspect-square" },
];

export default function MomentsSection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const { ref: viewRef, isInView } = useInView("300px");
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const shouldLoad = isBot || isInView;

  useEffect(() => {
    if (isBot || !isFullyLoaded || !shouldLoad) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade in header
      gsap.fromTo(
        ".moments-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
        }
      );

      // Stagger fade up for photos
      gsap.fromTo(
        ".moment-photo",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isFullyLoaded, isBot, shouldLoad]);

  return (
    <section ref={sectionRef} className="py-24 bg-luxury-light text-luxury-dark relative border-t border-luxury-taupe overflow-hidden">
      <div ref={viewRef} className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 moments-header opacity-0 flex flex-col items-center">
          <div className="w-16 h-16 bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mb-6">
            <Camera className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-medium mb-6 leading-tight">
            Moments & <span className="text-luxury-gold">Memories</span>
          </h2>
          <p className="text-lg text-luxury-mauve leading-relaxed">
            Every celebration tells a unique story. Experience the magic of weddings and events hosted at J's International Convention Centre. 
          </p>
        </div>

        {/* Masonry Gallery Grid */}
        <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 grid-flow-dense">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`moment-photo opacity-0 overflow-hidden rounded-2xl relative group shadow-lg border border-luxury-taupe bg-luxury-taupe/10 ${photo.style}`}
            >
              {shouldLoad ? (
                <img 
                  src={photo.src} 
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-luxury-taupe/15 animate-pulse" />
              )}
              <div className="absolute inset-0 bg-luxury-dark/0 group-hover:bg-luxury-dark/20 transition-colors duration-500" />
            </div>
          ))}
        </div>


        {/* Explore More Button */}
        <div className="mt-16 flex justify-center">
          <a 
            href="/gallery" 
            className="group relative inline-flex items-center justify-center px-8 py-4 font-medium tracking-wide text-luxury-light bg-luxury-dark rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 mix-blend-difference text-white">Explore Full Gallery</span>
            <div className="absolute inset-0 bg-luxury-gold transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </a>
        </div>

      </div>
    </section>
  );
}
