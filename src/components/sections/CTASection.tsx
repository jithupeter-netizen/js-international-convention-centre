"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Phone } from "lucide-react";
import { usePreloader } from "@/context/PreloaderContext";

export default function CTASection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isFullyLoaded, isBot]);

  return (
    <section ref={sectionRef} className="py-24 bg-luxury-cream text-luxury-dark relative border-t border-luxury-taupe overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="cta-content opacity-0 bg-luxury-light/40 backdrop-blur-md border border-luxury-taupe rounded-3xl p-8 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
            Let's Create Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-dark to-luxury-mauve">
              Next Celebration
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-luxury-mauve leading-relaxed max-w-2xl mx-auto mb-10">
            Whether you're planning a dream wedding, a corporate conference, or a memorable family gathering, our team is ready to help you create an unforgettable experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/contact" className="w-full sm:w-auto px-8 py-4 bg-luxury-dark text-luxury-light text-sm uppercase tracking-widest font-bold hover:bg-luxury-dark/90 transition-colors rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 duration-300">
              Book a Visit <ArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:+919567765059" className="w-full sm:w-auto px-8 py-4 border border-luxury-dark/30 text-luxury-dark text-sm uppercase tracking-widest font-bold hover:bg-luxury-dark/10 transition-colors rounded-full flex items-center justify-center gap-2 hover:scale-105 duration-300">
              <Phone className="w-4 h-4" /> Call Now
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
