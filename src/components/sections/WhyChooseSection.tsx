"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";
import { useInView } from "@/hooks/useInView";
import { MapPin, Trees, Car, Building, Home, ArrowRight } from "lucide-react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useCinematicPan } from "@/hooks/useCinematicPan";
import type { Viewer } from "@photo-sphere-viewer/core";

const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false, loading: () => <div className="w-full h-full bg-luxury-light/50 animate-pulse" /> }
);

const features = [
  {
    icon: <MapPin className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    title: "Privacy, Yet Perfectly Connected",
    description: "Well connected to NH 66 and other major roads, yet once you enter our premises, you step into a peaceful world of your own.",
    image: "/Images/Main building heli.webp"
  },
  {
    icon: <Trees className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    title: "More Than a Convention Centre",
    description: "Surrounded by greenery and thoughtfully designed spaces, our centre gives you the feel of a resort rather than a conventional concrete venue.",
    image: "/Images/360 for pages/Nature Inspired Campus.webp",
    is360: true
  },
  {
    icon: <Car className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    title: "Parking Without the Hassle",
    description: "With parking for 500+ cars and numerous buses, your guests can arrive and leave with ease and comfort.",
    image: "/Images/parking 04.webp"
  },
  {
    icon: <Building className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    title: "A Venue for Every Occasion",
    description: "From weddings and celebrations to corporate meetings, birthday parties, cultural programmes and performances, our spaces are designed for every occasion.",
    image: "/Images/Main hall.webp"
  },
  {
    icon: <Home className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    title: "Everything Under One Roof",
    description: "From luxurious suites and comfortable rooms to dormitory facilities and a large, well-equipped kitchen, everything you need is right here.",
    image: "/Images/Warm Hospitality.webp"
  }
];

const FeatureViewer = ({ src, isActive }: { src: string, isActive: boolean }) => {
  const viewerRef = useRef<Viewer | null>(null);
  useCinematicPan(viewerRef, 0.002, 0, isActive);

  return (
    <ReactPhotoSphereViewer
      src={src}
      height="100%"
      width="100%"
      defaultZoomLvl={0}
      mousewheel={false}
      navbar={false}
      onReady={(instance) => {
        viewerRef.current = instance;
      }}
    />
  );
};

export default function WhyChooseSection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const { ref: viewRef, isInView } = useInView("300px");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade in header
      gsap.fromTo(
        ".why-header",
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

      // Fade in the interactive section
      gsap.fromTo(
        ".why-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isFullyLoaded, isBot]);


  return (
    <section ref={sectionRef} className="py-24 bg-luxury-light text-luxury-dark relative border-t border-luxury-taupe overflow-hidden">
      <div ref={viewRef} className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 why-header opacity-0 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-medium mb-6 leading-tight">
            Why Choose <span className="text-luxury-gold">J’s?</span>
          </h2>
          <p className="text-lg md:text-xl text-luxury-mauve leading-relaxed mb-8">
            Thoughtfully designed spaces, resort-style greenery, and world-class amenities created to turn every occasion into a cherished memory.
          </p>
          <a 
            href="#tour" 
            className="inline-flex items-center gap-3 px-8 py-3 bg-luxury-gold text-luxury-dark text-sm uppercase tracking-widest font-medium rounded-full hover:bg-luxury-dark hover:text-luxury-gold transition-all duration-300 shadow-lg group"
          >
            Explore 360° Tour 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Interactive Showcase */}
        <div className="why-content opacity-0 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left: Image Display (Hidden on Mobile, Sticky on Desktop) */}
          <div className="hidden lg:block w-full lg:w-1/2 aspect-[4/3] md:aspect-video lg:aspect-square sticky top-28 rounded-3xl overflow-hidden shadow-2xl border border-luxury-taupe bg-luxury-taupe/20">
            
            {/* Preload and Mount All Features Individually to Prevent Flickering */}
            {features.map((feature, index) => (
              <div 
                key={index}
                id={`why-360-container-${index}`}
                className={clsx(
                  "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out pointer-events-none",
                  activeIndex === index ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                )}
              >
                {feature.is360 ? (
                  (!isBot && isFullyLoaded && isInView && mounted && !isMobile) && (
                    <FeatureViewer src={feature.image} isActive={activeIndex === index} />
                  )
                ) : (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            ))}
            
            {/* Gradient Overlay for luxury feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/40 to-transparent pointer-events-none z-30" />
          </div>

          {/* Right: Interactive List */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                aria-expanded={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                className={clsx(
                  "cursor-pointer rounded-2xl p-4 md:p-6 transition-all duration-500 border",
                  activeIndex === index 
                    ? "bg-luxury-light shadow-lg border-luxury-gold" 
                    : "bg-transparent border-transparent hover:bg-luxury-light/50"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={clsx(
                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl transition-colors duration-500 shrink-0",
                    activeIndex === index ? "bg-luxury-gold text-white" : "bg-luxury-taupe/30 text-luxury-dark"
                  )}>
                    {feature.icon}
                  </div>
                  <h3 className={clsx(
                    "text-lg md:text-2xl font-semibold transition-colors duration-500",
                    activeIndex === index ? "text-luxury-dark" : "text-luxury-mauve"
                  )}>
                    {feature.title}
                  </h3>
                </div>
                
                {/* Expandable Description (CSS Grid Accordion) */}
                <div className={clsx(
                  "grid transition-all duration-500 ease-in-out",
                  activeIndex === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                )}>
                  <div className="overflow-hidden">
                    <p className="text-luxury-mauve leading-relaxed pl-16 md:pl-20 pr-4 pb-2 text-sm md:text-base">
                      {feature.description}
                    </p>
                    
                    {/* Mobile Image Display */}
                    {mounted && isMobile && (
                      <div className="block lg:hidden w-[calc(100%-4rem)] ml-16 md:ml-20 aspect-video rounded-xl overflow-hidden relative mt-2 mb-4 shadow-lg border border-luxury-taupe/20 bg-luxury-taupe/10">
                        {feature.is360 ? (
                          (!isBot && isFullyLoaded && isInView && activeIndex === index) && (
                            <FeatureViewer src={feature.image} isActive={true} />
                          )
                        ) : (
                          <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        )}
                      </div>
                    )}

                    {index === features.length - 1 && (
                      <div className="pl-16 md:pl-20 pt-4 pb-4">
                        <a 
                          href="/spaces" 
                          className="inline-flex items-center gap-3 px-6 py-2 bg-luxury-taupe/20 border border-luxury-taupe/50 text-luxury-dark text-xs md:text-sm uppercase tracking-widest font-medium rounded-full hover:bg-luxury-gold hover:border-luxury-gold hover:text-white transition-all duration-300 group shadow-sm"
                        >
                          View Our Spaces
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
