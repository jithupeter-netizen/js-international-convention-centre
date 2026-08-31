"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";
import { useInView } from "@/hooks/useInView";
import dynamic from "next/dynamic";
import { useCinematicPan } from "@/hooks/useCinematicPan";
import type { Viewer } from "@photo-sphere-viewer/core";

const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false, loading: () => <div className="w-full h-full bg-luxury-light/50 animate-pulse" /> }
);

export default function IdeaSection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const { ref: viewRef, isInView } = useInView("300px");
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useCinematicPan(viewerRef, 0.002, 0, !isBot && isFullyLoaded && isInView);

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Text reveal animation
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );


    }, sectionRef);

    return () => ctx.revert();
  }, [isFullyLoaded, isBot]);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-luxury-light text-luxury-dark min-h-screen relative overflow-hidden">
      <div ref={viewRef} className="max-w-7xl mx-auto">
        <h2 
          ref={textRef}
          className="text-4xl md:text-6xl font-medium leading-tight max-w-4xl mx-auto text-center mb-16"
        >
          J’s International Convention Centre <br />
          <span className="text-luxury-mauve italic">Habitat of Excellence</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-lg">
            <img 
              src="/Images/Main building heli.webp" 
              alt="Architecture detail 1" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg md:text-xl leading-relaxed text-luxury-mauve text-justify">
              Welcome to J's International Convention Centre, one of the leading convention centres in Kollam, offering elegant event spaces for weddings, receptions, conferences, exhibitions, corporate meetings, and social celebrations. Set amidst a peaceful natural landscape, our venue combines spacious halls, modern amenities, ample parking, luxury guest accommodation, and warm hospitality to deliver seamless events of every scale. Discover a venue where beautiful surroundings and exceptional service come together to create unforgettable experiences.
            </p>
            <div id="idea-360-container" className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-lg mt-8 md:mt-auto pointer-events-none">
              {(!isBot && isFullyLoaded && isInView) ? (
                <ReactPhotoSphereViewer
                  src="/Images/360 for pages/Main hall.webp"
                  height="100%"
                  width="100%"
                  defaultZoomLvl={0}
                  mousewheel={false}
                  navbar={false}
                  onReady={(instance) => {
                    viewerRef.current = instance;
                  }}
                />
              ) : (
                <img 
                  src="/Images/360 for pages/Main hall.webp" 
                  alt="Main hall seating" 
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
