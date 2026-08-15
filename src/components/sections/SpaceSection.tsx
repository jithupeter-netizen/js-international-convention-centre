"use client";

import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, View, Play } from "lucide-react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";
import { useInView } from "@/hooks/useInView";
import { useCinematicPan } from "@/hooks/useCinematicPan";
import type { Viewer } from "@photo-sphere-viewer/core";

const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false, loading: () => <div className="w-full h-full bg-luxury-dark/10 animate-pulse flex items-center justify-center text-luxury-taupe">Loading Viewer...</div> }
);

interface SpaceSectionProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  images: string[];
  panoSrc?: string;
  reverse?: boolean;
}

export default function SpaceSection({ id, title, subtitle, description, features, images, panoSrc, reverse = false }: SpaceSectionProps) {
  const [viewMode, setViewMode] = useState<"slider" | "360">("slider");
  const [is360Loaded, setIs360Loaded] = useState(false);
  const { isFullyLoaded, isBot } = usePreloader();
  const { ref: viewRef, isInView } = useInView("800px", false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useCinematicPan(viewerRef, 0.002, 0, viewMode === "360" && isInView);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".space-content",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
        }
      );
      
      gsap.fromTo(
        ".space-media",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current && carouselRef.current.firstElementChild) {
      const scrollAmount = (carouselRef.current.firstElementChild as HTMLElement).offsetWidth + 24;
      carouselRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div id={id} ref={sectionRef} className="py-24 md:py-32 border-b border-luxury-taupe/20 last:border-b-0 overflow-hidden">
      <div ref={viewRef} className={`max-w-7xl mx-auto px-6 lg:px-12 flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}>
        
        {/* Content Side */}
        <div className="w-full lg:w-1/2 space-content opacity-0 z-10">
          <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-medium mb-6 leading-tight text-luxury-dark">
            {title}
          </h2>
          <p className="text-lg text-luxury-mauve leading-relaxed mb-8">
            {description}
          </p>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-luxury-dark/80">
                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold flex-shrink-0" />
                <span className="text-sm md:text-base">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setViewMode("slider")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${viewMode === "slider" ? "bg-luxury-dark text-white shadow-lg scale-105" : "border border-luxury-taupe text-luxury-dark hover:bg-luxury-taupe/10 hover:scale-105"}`}
            >
              <ImageIcon className="w-4 h-4" /> Image Gallery
            </button>
            {panoSrc && (
              <button 
                onClick={() => setViewMode("360")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${viewMode === "360" ? "bg-luxury-dark text-white shadow-lg scale-105" : "border border-luxury-taupe text-luxury-dark hover:bg-luxury-taupe/10 hover:scale-105"}`}
              >
                <View className="w-4 h-4" /> 360° View
              </button>
            )}
          </div>
        </div>

        {/* Media Side */}
        <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] lg:h-[600px] space-media opacity-0 relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-luxury-taupe/30">
          
          {viewMode === "slider" && (
            <div className="absolute inset-0 w-full h-full">
              <div 
                ref={carouselRef}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {images.map((src, idx) => (
                  <div key={idx} className="w-full h-full flex-none snap-center relative">
                    <img src={src} alt={`${title} view ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
              
              {/* Carousel Navigation */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors pointer-events-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={() => scrollCarousel('right')}
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors pointer-events-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {viewMode === "360" && isInView && panoSrc && (
            <div className="absolute inset-0 w-full h-full bg-black pointer-events-none">
              <ReactPhotoSphereViewer
                src={panoSrc}
                height="100%"
                width="100%"
                defaultZoomLvl={0}
                mousewheel={false}
                navbar={false}
                onReady={(instance) => {
                  viewerRef.current = instance;
                }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
