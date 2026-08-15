"use client";

import { useEffect, useRef, useState } from "react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePreloader } from "@/context/PreloaderContext";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const galleryImages = [
  { src: "/Gallery/a (1).jpeg", alt: "Wedding Celebration" },
  { src: "/Gallery/a (2).jpeg", alt: "Elegant Decor" },
  { src: "/Gallery/a (3).jpeg", alt: "Grand Reception" },
  { src: "/Gallery/a (4).jpeg", alt: "Beautiful Setup" },
  { src: "/Gallery/a (5).jpeg", alt: "Ceremony Moments" },
  { src: "/Gallery/a (6).jpeg", alt: "Stage Highlights" },
  { src: "/Gallery/a (7).jpeg", alt: "Venue Ambiance" },
  { src: "/Gallery/a (8).jpeg", alt: "Cherished Memories" },
];

export function GalleryClient() {
  const { isFullyLoaded, isBot } = usePreloader();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade in header text
      gsap.fromTo(
        ".gallery-header-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.2 }
      );

      // Staggered reveal for gallery items as they scroll into view
      const items = gsap.utils.toArray(".gallery-item");
      items.forEach((item: any) => {
        gsap.fromTo(
          item,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, galleryRef);

    return () => ctx.revert();
  }, [isFullyLoaded, isBot]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % galleryImages.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <main id="main-content" className="bg-luxury-light min-h-screen selection:bg-luxury-gold selection:text-white pt-[120px]">
      <Header />
      
      <div ref={galleryRef} className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-16 pb-32">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 pt-12">
          <div className="gallery-header-text opacity-0 inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-cream border border-luxury-taupe mb-6">
            <Maximize2 className="w-6 h-6 text-luxury-gold" />
          </div>
          <h1 className="gallery-header-text opacity-0 text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight text-luxury-dark">
            Our <span className="text-luxury-gold">Gallery</span>
          </h1>
          <p className="gallery-header-text opacity-0 text-lg md:text-xl text-luxury-mauve leading-relaxed max-w-2xl mx-auto">
            A curated collection of unforgettable moments, elegant setups, and beautiful celebrations hosted at J's International Convention Centre.
          </p>
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="gallery-item opacity-0 break-inside-avoid cursor-pointer group relative rounded-2xl overflow-hidden bg-luxury-cream shadow-md border border-luxury-taupe/30"
              onClick={() => setLightboxIndex(index)}
            >
              {/* Image */}
              <img 
                src={image.src} 
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.03]"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-white font-medium text-lg tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {image.alt}
                </span>
                <span className="text-white/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  Click to enlarge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center flex-col transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          ref={(el) => {
            if (el) {
              el.focus();
              const focusable = el.querySelectorAll('button');
              if (focusable.length > 0) focusable[0].focus();
              
              el.onkeydown = (e) => {
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.key === 'Tab') {
                  if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                  } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                  }
                }
              };
            }
          }}
          tabIndex={-1}
        >
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
            <div className="text-white/60 text-sm tracking-widest uppercase">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="text-white/60 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 bg-black/20 hover:bg-black/50 rounded-full z-50 backdrop-blur-md"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 bg-black/20 hover:bg-black/50 rounded-full z-50 backdrop-blur-md"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full p-4 md:p-16 flex items-center justify-center">
            <img 
              src={galleryImages[lightboxIndex].src} 
              alt={galleryImages[lightboxIndex].alt}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Caption */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-wide text-lg bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
              {galleryImages[lightboxIndex].alt}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
