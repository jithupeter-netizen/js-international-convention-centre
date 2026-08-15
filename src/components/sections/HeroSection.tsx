"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { usePreloader } from "@/context/PreloaderContext";
import { useAudio } from "@/context/AudioContext";
import type { Viewer } from "@photo-sphere-viewer/core";

// Dynamically import React Photo Sphere Viewer so it only renders on client side
const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false, loading: () => null }
);

const TRANSITION_DURATION_MS = 2000;
const ROTATION_SPEED = 0.002;
const DEFAULT_ZOOM = 0;

export default function HeroSection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const { isPlaying, toggleAudio } = useAudio();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Define your panoramas and the "best" center angle (in radians) for each.
  // 0 is the exact center of the image. 
  // 1.57 is 90 degrees to the right. 
  // -1.57 is 90 degrees to the left. 
  // 3.14 is exactly the back of the image.
  const PANORAMAS = [
    { 
      src: "/Images/main slide/slide 01.webp", 
      centerYaw: 0,
      heading: "One of Kollam's Premier Wedding Convention Centres",
      subheading: "A premium convention centre in Kollam offering elegant wedding venues, grand auditoriums, and nature-inspired spaces for unforgettable celebrations."
    },
    { 
      src: "/Images/main slide/slide 02.webp", 
      centerYaw: 0,
      heading: "Luxury Wedding Destination in Kollam",
      subheading: "Host weddings, receptions, corporate meetings, exhibitions, conferences, and cultural events in beautifully designed modern event spaces."
    },
    { 
      src: "/Images/main slide/slide 03.webp", 
      centerYaw: 0,
      heading: "Experience J's International Convention Centre",
      subheading: "Explore one of Kerala's finest convention centres through immersive 360° views and discover the perfect venue for your next celebration."
    }
  ];
  const [currentPanoIndex, setCurrentPanoIndex] = useState(0);
  const currentPanoIndexRef = useRef(0);

  const viewerRef = useRef<Viewer | null>(null);
  const isTransitioning = useRef(false);
  // Track rotation direction (1 = right, -1 = left). Start panning right.
  const rotationDirection = useRef(1);
  const slideTextRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Animate dynamic text on slide change
  useEffect(() => {
    if (slideTextRef.current) {
      // Wipe animation for the background block and text
      gsap.fromTo(
        slideTextRef.current,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0, x: -20 },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, x: 0, duration: 1.2, ease: "power3.inOut", delay: 0.1 }
      );
    }
  }, [currentPanoIndex]);

  // GSAP animations for pinning and parallax
  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Create a timeline that pins the Hero Section first
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500", // Pin for 500px of scroll
          pin: true,
          scrub: true,
        }
      });

      // Fade out the massive logo quickly while pinned
      pinTl.to(logoRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -50,
        ease: "power2.out",
      }, 0);

      // Fade out the center content while pinned
      pinTl.to(textRef.current, {
        opacity: 0,
        y: -30,
        ease: "power1.inOut"
      }, 0);

      // Parallax effect on the background wrapper (happens after the pin ends)
      gsap.to(bgWrapperRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Boundary-triggered Slideshow & Autorotate Loop
  useEffect(() => {
    let animationFrameId: number;

    const rotateViewer = () => {
      if (viewerRef.current && !isTransitioning.current && bgWrapperRef.current) {
        const rect = bgWrapperRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          try {
            const currentPos = viewerRef.current.getPosition();
            const targetCenter = PANORAMAS[currentPanoIndexRef.current].centerYaw;
            
            let delta = currentPos.yaw - targetCenter;
            
            while (delta > Math.PI) delta -= 2 * Math.PI;
            while (delta < -Math.PI) delta += 2 * Math.PI;
            
            const aspect = window.innerWidth / window.innerHeight;
            const hFov = 2 * Math.atan(aspect); 
            const halfScreenFov = hFov / 2;

            const absoluteEdgeLimit = 1.57; 

            const boundaryLimit = Math.max(0, absoluteEdgeLimit - halfScreenFov);
            
            let shouldTransition = false;
            
            if (rotationDirection.current === 1 && delta >= boundaryLimit) {
              rotationDirection.current = -1;
              shouldTransition = true;
            } 
            else if (rotationDirection.current === -1 && delta <= -boundaryLimit) {
              rotationDirection.current = 1; 
              shouldTransition = true;
            }

            if (shouldTransition) {
              isTransitioning.current = true;
              const nextIndex = (currentPanoIndexRef.current + 1) % PANORAMAS.length;
              currentPanoIndexRef.current = nextIndex;
              setCurrentPanoIndex(nextIndex);
              
              const nextTargetCenter = PANORAMAS[nextIndex].centerYaw;
              const startYaw = rotationDirection.current === -1 
                                ? nextTargetCenter + boundaryLimit 
                                : nextTargetCenter - boundaryLimit;
              
              viewerRef.current.setPanorama(PANORAMAS[nextIndex].src, {
                transition: TRANSITION_DURATION_MS as any,
                showLoader: false,
                position: { yaw: startYaw, pitch: 0 }
              }).then(() => {
                isTransitioning.current = false;
              }).catch(() => {
                isTransitioning.current = false;
              });
            } else {
              viewerRef.current.rotate({
                yaw: currentPos.yaw + (ROTATION_SPEED * rotationDirection.current),
                pitch: currentPos.pitch
              });
            }
          } catch (e) {
          }
        }
      }
      animationFrameId = requestAnimationFrame(rotateViewer);
    };

    if (mounted && isFullyLoaded && !isBot) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(rotateViewer);
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mounted, isFullyLoaded, isBot]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-luxury-cream"
    >
      {/* 360 Background Wrapper - pointer-events-none completely disables mouse/touch interactions */}
      <div
        ref={bgWrapperRef}
        className="absolute inset-0 w-full h-full scale-110 pointer-events-none"
      >
        {/* Layer 1: Instant Static Image (Fast LCP) */}
        <img 
          src={PANORAMAS[0].src} 
          alt="J's International Convention Centre" 
          className="absolute inset-0 w-full h-full object-cover object-center scale-150" 
          fetchPriority="high"
          rel="preload"
        />

        {/* Layer 2: 360 Viewer (Loads seamlessly on top AFTER window.onload) */}
        {(!isBot && isFullyLoaded) && (
          <div className="absolute inset-0 w-full h-full">
            <ReactPhotoSphereViewer
              src={PANORAMAS[0].src}
              height="100%"
              width="100%"
              defaultZoomLvl={DEFAULT_ZOOM}
              defaultYaw={PANORAMAS[0].centerYaw}
              onReady={(instance) => {
                viewerRef.current = instance;
              }}
              mousewheel={false}
            />
          </div>
        )}
      </div>

      {/* Dark Gradient Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-[5] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full w-full px-8 md:px-16 pt-[100px] md:pt-[120px] pb-24 md:pb-32 flex flex-col justify-between items-center pointer-events-none">

        {/* Massive Centered Logo */}
        <div 
          ref={logoRef}
          className="flex flex-col items-center pointer-events-auto cursor-pointer landing-spot mt-auto mb-auto w-full px-4"
        >
          <img 
            src="/pix/icon.svg" 
            alt="J's International Icon" 
            className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 mb-2 md:mb-4 invert drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
          />
          <span className="font-montserrat tracking-tight text-[min(8.5vw,2.75rem)] md:text-[4.5rem] lg:text-[5.6rem] text-center leading-[1] whitespace-nowrap text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            <span className="font-black">J's INTERNATIONAL</span><br />
            <span className="font-normal drop-shadow-xl">Convention Centre</span>
          </span>
        </div>

        {/* Centered Content Below Logo */}
        <div 
          ref={textRef} 
          className="flex flex-col items-center gap-6 w-full max-w-4xl px-2 mt-4 md:mt-8"
        >
          {/* Dynamic Animated Text Container with Block Background */}
          <div 
            ref={slideTextRef} 
            className="flex flex-col items-center gap-4 text-center px-6 md:px-10 py-6 md:py-8 bg-luxury-dark/85 backdrop-blur-md rounded-2xl border border-luxury-taupe/30 shadow-2xl pointer-events-auto"
          >
            <h1 className="text-xl md:text-2xl lg:text-3xl font-light text-luxury-light leading-tight">
              {PANORAMAS[currentPanoIndex].heading}
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-luxury-cream/90 font-light max-w-2xl">
              {PANORAMAS[currentPanoIndex].subheading}
            </p>
            
            <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
              <a href="/tour" className="px-8 py-3 bg-luxury-gold text-luxury-dark text-xs uppercase tracking-[0.2em] font-medium hover:bg-luxury-light transition-colors rounded-full landing-spot shadow-lg text-center flex items-center justify-center">
                360 Virtual Tour
              </a>
              <button 
                onClick={toggleAudio}
                className="px-8 py-3 border border-luxury-taupe text-luxury-light text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition-colors rounded-full flex items-center gap-2 landing-spot shadow-lg backdrop-blur-sm"
              >
                {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} 
                {isPlaying ? "Music Off" : "Music On"}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mt-2 text-white animate-bounce pointer-events-auto landing-spot">
            <span className="text-xs uppercase tracking-[0.25em] font-medium">Scroll Down</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
