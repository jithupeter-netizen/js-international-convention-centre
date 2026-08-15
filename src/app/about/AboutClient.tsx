"use client";

import { useEffect, useRef, useState } from "react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Award, HeartHandshake, Leaf, ShieldCheck, Lightbulb, Quote } from "lucide-react";

const ABOUT_SLIDES = [
  "/Images/main.webp",
  "/Images/Pallavi 2.webp",
  "/Images/Main hall.webp",
  "/Images/Endless Photography Locations 2.webp",
  "/Images/Endless Photography Locations.webp",
  "/Images/Conference Hall 2.webp",
];

function AboutSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ABOUT_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-luxury-taupe h-[400px] lg:h-[600px] w-full">
      {ABOUT_SLIDES.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`J's Convention Centre ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}`}
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
      <div className="absolute inset-0 bg-luxury-dark/10 pointer-events-none" />
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {ABOUT_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${idx === current ? 'w-8 bg-luxury-gold' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Parallax
      gsap.to(".about-hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Fade Up General Sections
      gsap.utils.toArray(".fade-up").forEach((el: any) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 2.5 Vision & Mission Cards Stagger
      gsap.fromTo(".vision-mission-card", 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".vision-mission-card", // First card triggers it
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 3. Stagger Values
      gsap.fromTo(".value-card", 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".values-grid",
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 4. Timeline Animation
      // Draw the line down
      gsap.fromTo(".timeline-line", 
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 50%",
            end: "bottom 70%",
            scrub: true,
          }
        }
      );

      // Pop in the nodes
      gsap.fromTo(".timeline-node",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 60%",
            end: "bottom 70%",
            scrub: 1,
          }
        }
      );

      // Fade in the timeline content
      gsap.fromTo(".timeline-content",
        { opacity: 0, x: (i) => i % 2 === 0 ? 30 : -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 60%",
            end: "bottom 70%",
            scrub: 1,
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main id="main-content" ref={containerRef} className="bg-luxury-light min-h-screen flex flex-col overflow-hidden">
      <Header />

      {/* 1. Hero Section */}
      <section className="about-hero relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="about-hero-bg absolute inset-0 w-full h-[130%] -top-[15%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/pix/main.webp')" }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3A2D28]/40 via-[#3A2D28]/60 to-[#3A2D28]" />
        
        <div className="relative z-10 text-center px-6 pt-20">
          <h1 className="text-5xl md:text-7xl font-light text-luxury-light tracking-tight mb-4 drop-shadow-xl">
            About Us
          </h1>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="py-24 px-6 md:px-12 relative z-10 -mt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center fade-up">
          
          {/* Left Side: Image Slideshow */}
          <AboutSlideshow />

          {/* Right Side: Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl font-medium text-luxury-dark leading-tight mb-8">
              A Destination Where Celebrations <br className="hidden lg:block" />
              <span className="text-luxury-gold">Find Their Perfect Setting</span>
            </h2>
            
            <div className="space-y-6 text-luxury-mauve text-lg leading-relaxed text-justify lg:text-left font-light">
              <p>
                Nestled amidst the serene greenery of Kalluvathukkal in Kollam, J's International Convention Centre is more than a venue—it is a destination thoughtfully created for life's most cherished celebrations. Blending contemporary architecture with the beauty of nature, J's offers an elegant environment where every wedding, reception, conference, exhibition, cultural programme, and social gathering becomes an unforgettable experience.
              </p>
              <p>
                Designed with both comfort and functionality in mind, our convention centre features spacious event halls, professional conference facilities, landscaped outdoor spaces, luxury guest accommodation, modern dining complexes, and world-class amenities. Every detail has been carefully planned to ensure seamless events while providing guests with an atmosphere of warmth, sophistication, and exceptional hospitality.
              </p>
              <p>
                At J's, we believe that memorable celebrations begin long before the event itself. From the tree-lined entrance and peaceful gardens to the thoughtfully designed interiors and welcoming service, every moment is crafted to create lasting impressions. Whether you are hosting an intimate family celebration or a grand wedding, our commitment remains the same—to transform every occasion into a beautiful memory.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. Vision & Mission */}
      <section className="py-20 px-6 md:px-12 border-y border-luxury-taupe relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-luxury-taupe/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 relative z-10">
          
          <div className="vision-mission-card opacity-0 bg-luxury-cream p-10 rounded-3xl border border-luxury-taupe shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform group-hover:scale-150 duration-700" />
            <h3 className="text-3xl font-semibold text-luxury-dark mb-6">Our Vision</h3>
            <p className="text-luxury-mauve leading-relaxed text-justify text-lg font-light">
              To be a distinguished destination for celebrations, gatherings and memorable occasions, where excellence, elegance and warmth come together to create experiences that people cherish.
            </p>
          </div>

          <div className="vision-mission-card opacity-0 bg-luxury-cream p-10 rounded-3xl border border-luxury-taupe shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-luxury-taupe/30 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none transition-transform group-hover:scale-150 duration-700" />
            <h3 className="text-3xl font-semibold text-luxury-dark mb-6">Our Mission</h3>
            <p className="text-luxury-mauve leading-relaxed text-justify text-lg font-light">
              To create exceptional experiences through thoughtfully designed spaces, outstanding facilities, personalised service and meticulous attention to detail, while continually raising the standards of hospitality and events. We strive to make every occasion truly special, in keeping with our motto: &ldquo;Habitat of Excellence.&rdquo;
            </p>
          </div>

        </div>
      </section>

      {/* 4. Founder's Message */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium text-luxury-dark mb-4">From the Founder</h2>
            <p className="text-luxury-gold tracking-widest uppercase text-sm">A Vision Built with Passion</p>
          </div>
          
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center bg-luxury-cream/50 p-6 md:p-12 rounded-3xl border border-luxury-taupe backdrop-blur-sm relative">
            <Quote className="absolute top-12 left-12 w-24 h-24 text-luxury-dark/5 pointer-events-none hidden md:block" />
            
            {/* Founder Picture */}
            <div className="md:col-span-5 relative z-10 h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="/Images/Founder.jpeg" 
                alt="Mr. Jayakrishnan - Founder" 
                className="w-full h-full object-cover object-top transition-all duration-700"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Founder Message */}
            <div className="md:col-span-7 relative z-10 md:pl-6">
              <p className="text-xl md:text-2xl text-luxury-dark italic leading-relaxed font-normal mb-8 text-justify md:text-left">
                &ldquo;This centre is the fulfilment of a dream built over many years&mdash;with integrity as my foundation, perseverance as my strength, and an uncompromising pursuit of excellence as my guiding principle. Every venture I have undertaken has demanded hard work, patience and countless sacrifices, and I have always believed that anything worth creating deserves to be done with sincerity and care. Along this journey, I have been fortunate to earn not only achievements, but also the trust and friendship of people who have enriched my life. My years as an alumnus of IIM Kozhikode further strengthened my belief that learning, humility and excellence must go hand in hand. J’s International Convention Centre is therefore more than a building to me; it is a reflection of the values I have cherished throughout my journey, and I hope every person who walks through its doors feels the warmth, dignity and commitment with which it has been created.&rdquo;
              </p>

              <div className="border-t border-luxury-taupe pt-6">
                <h4 className="text-2xl font-medium text-luxury-dark mb-1">Mr. Jayakrishnan</h4>
                <p className="text-luxury-gold font-medium">Founder, J's International Convention Centre</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Values Grid */}
      <section className="py-24 px-6 md:px-12 border-t border-luxury-taupe relative">
        <div className="max-w-6xl mx-auto values-grid relative z-10">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-5xl font-medium text-luxury-dark mb-4">Our Values</h2>
            <p className="text-luxury-mauve">The principles that guide everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            
            <div className="value-card bg-luxury-cream p-8 rounded-2xl border border-luxury-taupe text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl">
              <div className="w-16 h-16 mx-auto bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-dark mb-3">Excellence</h3>
              <p className="text-luxury-mauve text-sm">Delivering exceptional quality in every event we host.</p>
            </div>

            <div className="value-card bg-luxury-cream p-8 rounded-2xl border border-luxury-taupe text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl">
              <div className="w-16 h-16 mx-auto bg-luxury-taupe/20 text-luxury-dark rounded-full flex items-center justify-center mb-6">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-dark mb-3">Hospitality</h3>
              <p className="text-luxury-mauve text-sm">Welcoming every guest with warmth, respect, and genuine care.</p>
            </div>

            <div className="value-card bg-luxury-cream p-8 rounded-2xl border border-luxury-taupe text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl">
              <div className="w-16 h-16 mx-auto bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-dark mb-3">Nature</h3>
              <p className="text-luxury-mauve text-sm">Preserving and celebrating the beauty of our green surroundings.</p>
            </div>

            <div className="value-card bg-luxury-cream p-8 rounded-2xl border border-luxury-taupe text-center hover:-translate-y-2 transition-transform duration-300 lg:col-start-1 lg:translate-x-1/2 shadow-xl">
              <div className="w-16 h-16 mx-auto bg-luxury-taupe/20 text-luxury-dark rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-dark mb-3">Trust</h3>
              <p className="text-luxury-mauve text-sm">Building lifelong relationships through reliability and integrity.</p>
            </div>

            <div className="value-card bg-luxury-cream p-8 rounded-2xl border border-luxury-taupe text-center hover:-translate-y-2 transition-transform duration-300 lg:translate-x-1/2 shadow-xl">
              <div className="w-16 h-16 mx-auto bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-dark mb-3">Innovation</h3>
              <p className="text-luxury-mauve text-sm">Continuously enhancing our facilities and services to create better experiences.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Our Journey (Timeline) */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto timeline-container relative">
          
          <div className="text-center mb-20 fade-up">
            <h2 className="text-3xl md:text-5xl font-medium text-luxury-dark mb-4">Our Journey</h2>
            <p className="text-luxury-mauve">The story of a growing institution.</p>
          </div>

          {/* The Vertical Line Background */}
          <div className="absolute left-6 md:left-1/2 top-40 bottom-0 w-1 bg-luxury-taupe md:-translate-x-1/2 rounded-full" />
          
          {/* The Animated Vertical Line */}
          <div className="timeline-line absolute left-6 md:left-1/2 top-40 w-1 bg-luxury-gold md:-translate-x-1/2 rounded-full origin-top" />

          <div className="space-y-16 md:space-y-24 relative z-10">
            
            {/* Timeline Item 1 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between group">
              <div className="hidden md:block w-[45%] text-right pr-12 timeline-content">
                <h3 className="text-2xl font-bold text-luxury-dark mb-2">Founded</h3>
                <p className="text-luxury-mauve">A vision to create a nature-inspired convention centre in Kollam.</p>
              </div>
              <div className="absolute left-6 md:left-1/2 w-6 h-6 bg-luxury-light border-4 border-luxury-gold rounded-full md:-translate-x-1/2 mt-1 md:mt-0 timeline-node shadow-[0_0_15px_rgba(203,173,141,0.5)]" />
              <div className="md:hidden pl-16 timeline-content">
                <h3 className="text-2xl font-bold text-luxury-dark mb-2">Founded</h3>
                <p className="text-luxury-mauve">A vision to create a nature-inspired convention centre in Kollam.</p>
              </div>
              <div className="hidden md:block w-[45%]" />
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between group">
              <div className="hidden md:block w-[45%]" />
              <div className="absolute left-6 md:left-1/2 w-6 h-6 bg-luxury-light border-4 border-luxury-taupe rounded-full md:-translate-x-1/2 mt-1 md:mt-0 timeline-node shadow-[0_0_15px_rgba(209,199,189,0.5)]" />
              <div className="w-[45%] pl-16 md:pl-12 timeline-content">
                <h3 className="text-2xl font-bold text-luxury-dark mb-2">Designed</h3>
                <p className="text-luxury-mauve">A campus where modern architecture blends seamlessly with nature.</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between group">
              <div className="hidden md:block w-[45%] text-right pr-12 timeline-content">
                <h3 className="text-2xl font-bold text-luxury-dark mb-2">Today</h3>
                <p className="text-luxury-mauve">A trusted destination for weddings, corporate events, exhibitions, and celebrations.</p>
              </div>
              <div className="absolute left-6 md:left-1/2 w-6 h-6 bg-luxury-light border-4 border-luxury-gold rounded-full md:-translate-x-1/2 mt-1 md:mt-0 timeline-node shadow-[0_0_15px_rgba(203,173,141,0.5)]" />
              <div className="md:hidden pl-16 timeline-content">
                <h3 className="text-2xl font-bold text-luxury-dark mb-2">Today</h3>
                <p className="text-luxury-mauve">A trusted destination for weddings, corporate events, exhibitions, and celebrations.</p>
              </div>
              <div className="hidden md:block w-[45%]" />
            </div>

            {/* Timeline Item 4 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between group">
              <div className="hidden md:block w-[45%]" />
              <div className="absolute left-6 md:left-1/2 w-6 h-6 bg-luxury-light border-4 border-luxury-taupe rounded-full md:-translate-x-1/2 mt-1 md:mt-0 timeline-node shadow-[0_0_15px_rgba(209,199,189,0.5)]" />
              <div className="w-[45%] pl-16 md:pl-12 timeline-content">
                <h3 className="text-2xl font-bold text-luxury-dark mb-2">Tomorrow</h3>
                <p className="text-luxury-mauve">Continuing to create unforgettable experiences for generations to come.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
