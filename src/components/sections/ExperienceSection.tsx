"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";
import { useCarousel } from "@/hooks/useCarousel";

const facilities: { title: React.ReactNode; description: string }[] = [
  {
    title: "Grand Auditorium",
    description: "A spacious, fully air-conditioned auditorium with an innovative arc-shaped seating layout, modern stage, professional lighting, and premium audio—designed for weddings, receptions, conferences, and cultural events.",
  },
  {
    title: <><i>Sruthi</i> - Conference Hall</>,
    description: "A professional venue with permanent classroom-style seating for meetings, workshops, seminars, and training programmes.",
  },
  {
    title: <><i>Layam</i> - Banquet</>,
    description: "An elegant, air-conditioned hall perfect for family celebrations, engagements, business gatherings, and private events.",
  },
  {
    title: "Dining Complex – Sadyaalayam",
    description: "Two spacious dining halls serving up to 700 guests with efficient service flow and elevator access.",
  },
  {
    title: "Modern Kitchen",
    description: "A professionally designed kitchen capable of supporting large weddings and major events with ease.",
  },
  {
    title: "Luxury Guest Suites",
    description: "Comfortable accommodation for family members, special guests, and wedding parties, along with dedicated green rooms.",
  },
  {
    title: <><i>Pallavi</i> - Open-Air Amphitheatre</>,
    description: "A beautiful outdoor venue for music performances, cultural programmes, and memorable evening celebrations.",
  },
  {
    title: "Open air turf",
    description: "A scenic outdoor space ideal for receptions, exhibitions, corporate gatherings, and open-air dining.",
  },
  {
    title: "Ample Parking",
    description: "Extensive parking for 500+ cars and buses with easy access and guest-friendly circulation throughout the campus.",
  }
];

export default function ExperienceSection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const sectionRef = useRef<HTMLDivElement>(null);
  const facilitiesColRef = useRef<HTMLDivElement>(null);
  const facilitiesCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const facilitiesCarouselRef = useCarousel(3500, 24);
  const galleryCarouselRef = useCarousel(3000, 24);

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade in the facilities container
      if (facilitiesColRef.current) {
        gsap.fromTo(
          facilitiesColRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
          }
        );
      }

      // Stagger facility cards
      if (facilitiesCardsRef.current.length > 0) {
        gsap.fromTo(
          facilitiesCardsRef.current.filter(Boolean),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: facilitiesColRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse"
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isFullyLoaded, isBot]);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    const el = ref.current;
    if (el && el.firstElementChild) {
      const childWidth = (el.firstElementChild as HTMLElement).offsetWidth;
      const amount = direction === 'left' ? -(childWidth + 24) : (childWidth + 24);
      el.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section id="spaces" ref={sectionRef} className="py-24 bg-luxury-cream text-luxury-dark relative overflow-hidden border-t border-luxury-taupe">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Facilities Intro & Carousel */}
        <div ref={facilitiesColRef} className="w-full opacity-0">
          
          {/* Intro Header */}
          <div className="mb-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-medium mb-8 leading-tight">
              World-Class Facilities for <br/> <span className="text-luxury-gold">Every Celebration</span>
            </h2>
            <p className="text-lg md:text-xl text-luxury-mauve leading-relaxed text-justify md:text-center">
              Every successful event begins with the right venue. At J's International Convention Centre, every facility has been thoughtfully designed to provide comfort, convenience, and a seamless experience for hosts and guests alike. Surrounded by lush greenery and modern architecture, J's offers the perfect setting for weddings, receptions, corporate events, exhibitions, cultural programmes, and family celebrations of every scale.
            </p>
          </div>

          {/* Facilities Carousel */}
          <div className="relative mb-16">
            <div 
              ref={facilitiesCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {facilities.map((facility, index) => (
                <div 
                  key={index} 
                  ref={el => { facilitiesCardsRef.current[index] = el; }}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-none snap-start bg-luxury-dark/5 border border-luxury-taupe rounded-2xl p-6 hover:bg-luxury-dark/10 hover:border-luxury-dark/20 transition-all duration-300 cursor-default shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-3 text-luxury-dark">
                    {facility.title}
                  </h3>
                  <p className="text-luxury-mauve leading-relaxed text-sm">
                    {facility.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={() => scrollCarousel(facilitiesCarouselRef, 'left')}
                className="w-12 h-12 rounded-full border border-luxury-dark/20 flex items-center justify-center hover:bg-luxury-dark/10 hover:border-luxury-dark/40 transition-colors"
                aria-label="Previous facility"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={() => scrollCarousel(facilitiesCarouselRef, 'right')}
                className="w-12 h-12 rounded-full border border-luxury-dark/20 flex items-center justify-center hover:bg-luxury-dark/10 hover:border-luxury-dark/40 transition-colors"
                aria-label="Next facility"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="border-t border-luxury-taupe pt-12 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl font-medium text-luxury-dark italic leading-relaxed text-center">
              "More than a collection of facilities, J's International Convention Centre offers an environment where modern comfort meets the beauty of nature—creating unforgettable celebrations from the moment your guests arrive until the memories last a lifetime."
            </p>
          </div>

        </div>

        {/* Auditorium Gallery */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-medium text-luxury-dark mb-4">Experience Our Spaces</h2>
            <p className="text-luxury-mauve text-lg">A glimpse into the elegance of J's International Convention Centre.</p>
          </div>
          
          <div className="relative max-w-[100rem] mx-auto">
            <div 
              ref={galleryCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {[
                { src: "/Images/Main hall.webp", label: "Grand Auditorium" },
                { src: "/Images/Endless Photography Locations 2.webp", label: "Beautiful Locations" },
                { src: "/Images/Conference Hall.webp", label: "Conference Hall" },
                { src: "/Images/Banquet Hall 01.webp", label: "Banquet Hall" },
                { src: "/Images/Endless Photography Locations.webp", label: "Open Lawn" },
                { src: "/Images/Conference Hall 2.webp", label: "Professional Spaces" },
                { src: "/Images/Pallavi 2.webp", label: "Amphitheatre" },
              ].map((item, index) => (
                <div key={index} className="relative h-64 md:h-[400px] w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-none snap-center rounded-2xl overflow-hidden group shadow-lg border border-luxury-taupe">
                  <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-luxury-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-medium text-xl tracking-wider uppercase text-center px-4">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={() => scrollCarousel(galleryCarouselRef, 'left')}
                className="w-12 h-12 rounded-full border border-luxury-dark/20 flex items-center justify-center hover:bg-luxury-dark/10 hover:border-luxury-dark/40 transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={() => scrollCarousel(galleryCarouselRef, 'right')}
                className="w-12 h-12 rounded-full border border-luxury-dark/20 flex items-center justify-center hover:bg-luxury-dark/10 hover:border-luxury-dark/40 transition-colors"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <a 
              href="/tour" 
              className="group relative inline-flex items-center justify-center px-10 py-5 font-medium tracking-wide text-luxury-light bg-luxury-dark rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-2xl"
            >
              <span className="relative z-10 mix-blend-difference text-white">Take a 360° Virtual Tour</span>
              <div className="absolute inset-0 bg-luxury-gold transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
