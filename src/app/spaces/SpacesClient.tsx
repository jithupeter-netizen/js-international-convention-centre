"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SpaceSection from '@/components/sections/SpaceSection';
import { useCarousel } from "@/hooks/useCarousel";
import { useCinematicPan } from "@/hooks/useCinematicPan";
import type { Viewer } from "@photo-sphere-viewer/core";

const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false, loading: () => <div className="w-full h-full bg-luxury-dark/10 animate-pulse flex items-center justify-center text-luxury-taupe">Loading Viewer...</div> }
);

// Removed Grand Auditorium and Green Rooms to display them distinctly at the top.
const SPACES_DATA = [
  {
    id: "conference-hall-sruthi",
    title: "Conference Hall",
    subtitle: "Sruthi",
    description: "An elegant and professional setting for corporate events, board meetings, and intimate gatherings. Equipped with modern presentation technology and premium furnishings.",
    features: ["Capacity for 200 attendees", "High-definition projectors", "Video conferencing ready", "Dedicated registration area"],
    images: ["/Images/Conference Hall 2.webp", "/Images/Conference Hall.webp"],
    panoSrc: "/Images/360 for pages/Conference Hall.webp"
  },
  {
    id: "banquet-hall-layam",
    title: "Banquet Hall",
    subtitle: "Layam",
    description: "A beautifully appointed banquet hall perfect for receptions, milestone birthdays, and exclusive corporate dinners. Offers a warm, luxurious ambiance.",
    features: ["Seating for 500 guests", "Customizable floor plans", "Integrated sound system", "Direct kitchen access"],
    images: ["/Images/Banquet Hall 01.webp", "/Images/Banquet Hall 02.webp"],
    panoSrc: "/Images/360 for pages/Banquet Hall.webp"
  },
  {
    id: "amphitheatre-pallavi",
    title: "Amphitheatre",
    subtitle: "Pallavi",
    description: "A stunning open-air amphitheatre designed for cultural performances, musical evenings, and outdoor wedding ceremonies under the stars.",
    features: ["Tiered seating arrangement", "Acoustically tuned stage", "Surrounded by lush greenery", "Dedicated artist green rooms"],
    images: ["/Images/Pallavi 1.webp", "/Images/Pallavi 2.webp"],
    panoSrc: "/Images/360 for pages/Pallavi.webp"
  },
  {
    id: "open-lawn",
    title: "Open Lawn",
    subtitle: "Nature's Canvas",
    description: "Sprawling, meticulously manicured green lawns offering a picturesque backdrop for grand outdoor receptions, exhibitions, and photoshoots.",
    features: ["Over 50,000 sq ft of space", "Landscape lighting", "Paved walkways", "Marquee/Tent compatible"],
    images: ["/Images/Endless Photography Locations.webp", "/Images/Endless Photography Locations 2.webp"],
    panoSrc: "/Images/360 for pages/Endless Photography Locations 2.webp"
  },
  {
    id: "dining-complex-sadyaalayam",
    title: "Dining Complex",
    subtitle: "Sadyaalayam",
    description: "A massive, hygienic dining complex capable of serving thousands of guests simultaneously. Perfectly designed for traditional Kerala Sadya and lavish buffets.",
    features: ["Simultaneous dining for 1500", "Spacious handwash stations", "Ventilated, bright interiors", "Dedicated buffet zones"],
    images: ["/Images/Sadyaalayam2.webp", "/Images/Sadyaalayam.webp"],
    panoSrc: "/Images/360 for pages/Sadyaalayam 360.webp"
  },
  {
    id: "luxury-suites",
    title: "Luxury Suites",
    subtitle: "Premium Accommodation",
    description: "Exquisitely designed suites providing unparalleled comfort and luxury for the hosts and VIP guests to relax and prepare for the grand event.",
    features: ["Plush king-size beds", "En-suite luxury bathrooms", "24/7 room service", "Climate control"],
    images: ["/Images/Luxury Suites 01.jpeg", "/Images/Luxury Suites 02.jpeg", "/Images/room 03.webp"]
  },
  {
    id: "modern-kitchen",
    title: "Modern Kitchen",
    subtitle: "Culinary Excellence",
    description: "An ultra-modern, fully equipped commercial kitchen maintaining the highest standards of hygiene and capacity to cater to massive gatherings.",
    features: [
      "4,000 Sq. Ft. Spacious Kitchen",
      "High Ventilation & Processed Water",
      "Built for Large Gatherings",
      "Seamless Cooking-to-Dining Coordination"
    ],
    images: ["/Images/kitchen 01.webp", "/Images/kitchen 02.webp"]
  },
  {
    id: "parking-accessibility",
    title: "Parking & Accessibility",
    subtitle: "Seamless Arrivals",
    description: "Expansive, well-organized parking facilities ensuring a smooth arrival experience for all your guests, complete with valet services and accessibility features.",
    features: ["Parking for 1000+ vehicles", "Dedicated bus parking", "Wheelchair accessible paths", "Security & traffic management"],
    images: ["/Images/parking 01.webp", "/Images/parking 02.webp", "/Images/parking 03.webp"],
    panoSrc: "/Images/parking 04.webp"
  }
];

export function SpacesClient() {
  const viewerRef = useRef<Viewer | null>(null);
  
  // Use our custom hooks
  const mainHallCarouselRef = useCarousel(3000, 16);
  const greenRoomsCarouselRef = useCarousel(3500, 12);
  useCinematicPan(viewerRef, 0.002, 0, true);

  return (
    <main className="min-h-screen bg-luxury-light text-luxury-dark pt-[80px] md:pt-[100px]">
      <Header />
      
      {/* Page Title Header */}
      <div className="text-center max-w-4xl mx-auto mb-16 pt-12 md:pt-16 px-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight text-luxury-dark">
          Our <span className="text-luxury-gold">Spaces</span>
        </h1>
        <p className="text-lg md:text-xl text-luxury-mauve leading-relaxed max-w-2xl mx-auto">
          Discover a venue where beautiful surroundings and exceptional service come together to create unforgettable experiences of every scale.
        </p>
      </div>
      
      {/* Grand Auditorium Hero (100% Width 360) */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-black">
        <div id="spaces-hero-360" className="absolute inset-0 pointer-events-none">
          <ReactPhotoSphereViewer
            src="/Images/360 for pages/Main hall full.webp"
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
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10">
          <div className="max-w-7xl mx-auto">
            <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm md:text-base font-medium block mb-2 drop-shadow-md">The Main Hall</span>
            <h2 className="text-5xl md:text-7xl font-medium text-white drop-shadow-lg">Grand Auditorium</h2>
          </div>
        </div>
      </section>

      {/* Main Hall Content + Green Rooms Integration */}
      <section className="py-20 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto border-b border-luxury-taupe/20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Hall Details */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 text-luxury-dark">A Spectacular Expansive View</h2>
            <p className="text-lg text-luxury-mauve leading-relaxed mb-10">
              Designed to host majestic weddings and massive conventions, the Grand Auditorium is our crown jewel. Featuring state-of-the-art acoustics, customizable lighting, and an expansive seating capacity that guarantees an unforgettable experience for every guest.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <li className="flex items-center gap-3 text-luxury-dark/90">
                <div className="w-2 h-2 rounded-full bg-luxury-gold flex-shrink-0" />
                <span className="font-medium text-lg">Luxury, reclinable seats</span>
              </li>
              <li className="flex items-center gap-3 text-luxury-dark/90">
                <div className="w-2 h-2 rounded-full bg-luxury-gold flex-shrink-0" />
                <span className="font-medium text-lg">Close view of the stage from every corner</span>
              </li>
              <li className="flex items-center gap-3 text-luxury-dark/90">
                <div className="w-2 h-2 rounded-full bg-luxury-gold flex-shrink-0" />
                <span className="font-medium text-lg">Acoustic treatments with RCF, Italy</span>
              </li>
              <li className="flex items-center gap-3 text-luxury-dark/90">
                <div className="w-2 h-2 rounded-full bg-luxury-gold flex-shrink-0" />
                <span className="font-medium text-lg">Centralized air conditioning</span>
              </li>
            </ul>

            {/* Grand Auditorium Image Slider */}
            <div ref={mainHallCarouselRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 mt-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {[
                "/Images/01.webp", 
                "/Images/02.webp", 
                "/Images/03.webp"
              ].map((src, idx) => (
                <div key={idx} className="w-[85%] md:w-[320px] flex-none snap-center rounded-2xl overflow-hidden shadow-lg border border-luxury-taupe/30 relative aspect-video">
                  <img src={src} alt={`Grand Auditorium ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Green Rooms Panel */}
          <div className="lg:w-1/3 bg-luxury-cream p-8 md:p-10 rounded-3xl border border-luxury-taupe/30 shadow-xl relative overflow-hidden">
            {/* Decorative BG element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-bl-full pointer-events-none" />
            
            <span className="text-luxury-gold uppercase tracking-[0.2em] text-xs font-medium block mb-2">Bridal & Artist Suites</span>
            <h3 className="text-2xl font-medium mb-4 text-luxury-dark">Green Rooms</h3>
            <p className="text-luxury-mauve leading-relaxed mb-8 text-sm md:text-base">
              Spacious, well-lit green rooms located conveniently next to the main stage, providing complete privacy and comfort for brides, grooms, and performers.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-luxury-dark/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold flex-shrink-0" />
                <span>Professional vanity mirrors</span>
              </li>
              <li className="flex items-center gap-3 text-luxury-dark/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold flex-shrink-0" />
                <span>Attached dressing & rest rooms</span>
              </li>
              <li className="flex items-center gap-3 text-luxury-dark/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold flex-shrink-0" />
                <span>Direct & private stage access</span>
              </li>
            </ul>

            {/* Green Rooms Image Slider */}
            <div ref={greenRoomsCarouselRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 mt-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {[
                "/Images/greenroom 01.webp", 
                "/Images/greenroom 02.webp"
              ].map((src, idx) => (
                <div key={idx} className="w-[85%] flex-none snap-center rounded-xl overflow-hidden shadow-md border border-luxury-taupe/20 relative aspect-[4/3]">
                  <img src={src} alt={`Green Room ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro for other spaces */}
      <section className="pt-20 pb-10 text-center px-6 relative">
        <h2 className="text-3xl md:text-5xl font-medium mb-6 text-luxury-dark">
          Explore <span className="text-luxury-gold">More Spaces</span>
        </h2>
        <p className="text-lg text-luxury-mauve max-w-3xl mx-auto leading-relaxed">
          From intimate banquet halls to lush open lawns, discover the perfect setting for every aspect of your celebration.
        </p>
      </section>

      {/* Other Spaces Listing */}
      <div className="flex flex-col">
        {SPACES_DATA.map((space, index) => (
          <SpaceSection 
            key={space.id}
            id={space.id}
            title={space.title}
            subtitle={space.subtitle}
            description={space.description}
            features={space.features}
            images={space.images}
            panoSrc={space.panoSrc}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>

      <Footer />
    </main>
  );
}
