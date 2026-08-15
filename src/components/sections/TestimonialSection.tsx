"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/context/PreloaderContext";
import { useCarousel } from "@/hooks/useCarousel";

const reviews = [
  {
    name: "Ramesh S.S",
    review: "Excellent venue for events! The AC auditorium and dining hall are spacious and well-maintained. They have ample car parking space, and the beautiful landscape adds a premium feel to the entire place. Highly recommended.",
  },
  {
    name: "Saleena nath",
    review: "The venue has a great ambience with a luxury feel, ample parking space, and a spacious layout that never feels congested. The lavish setup allows free movement and offers superb facilities. Both open-air and indoor spaces are available, surrounded by lots of greenery. The rates are reasonable, making it a perfect choice for any type of function including marriages, receptions, engagement ceremonies, birthday parties, family gatherings, office events, and corporate functions. It also has ample seating capacity to comfortably accommodate guests.",
  },
  {
    name: "Ranju Mohan",
    review: "The name Convention centre means it is this place. Beautiful sceneries, well maintained auditorium, dining, rooms, etc. ❤️ there is no word in the dictionary to explain the beauty and neatness of Js Convention centre. It is a kerala convention centre with international perspective. All words from heart.",
  },
  {
    name: "Amal Krishnan",
    review: "A beautiful and spacious venue with lush greenery, a lovely landscaped garden, a small pond, and a stunning open lawn stage. Excellent parking facilities and a perfect place for weddings and special events.",
  },
  {
    name: "Aryodayakumar Udayakumar",
    review: "A beautiful and spacious convention center with a peaceful, green, and well-maintained surroundings. The venue features a stunning landscaped garden with a small decorative pond, making it a lovely spot for photography. The elegant and spacious building, along with a beautiful open stage set on a well-maintained green lawn, adds to the charm of the venue. There is also ample parking space, making it convenient for guests. Overall, a wonderful and well-designed venue that is ideal for weddings, receptions, and other special events.",
  }
];

const StarRating = () => (
  <div className="flex gap-1 text-yellow-400 mb-4">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

export default function TestimonialSection() {
  const { isFullyLoaded, isBot } = usePreloader();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const carouselRef = useCarousel(5000, 24);

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade in the entire section
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse"
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isFullyLoaded, isBot]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (el && el.firstElementChild) {
      const childWidth = (el.firstElementChild as HTMLElement).offsetWidth;
      const amount = direction === 'left' ? -(childWidth + 24) : (childWidth + 24);
      el.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-luxury-light text-luxury-dark relative border-t border-luxury-taupe overflow-hidden">
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 md:px-12 opacity-0">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-cream border border-luxury-taupe mb-6">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-luxury-gold" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-semibold tracking-wider uppercase text-luxury-gold">4.9/5 Average Rating</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-medium mb-6 leading-tight">
            Loved by Guests, <br/> <span className="text-luxury-gold">Trusted by Hosts</span>
          </h2>
          <p className="text-luxury-mauve text-lg max-w-2xl mx-auto">
            Read what our clients have to say about their unforgettable experiences at J's International Convention Centre.
          </p>
        </div>

        {/* Carousel Layout for Reviews */}
        <div className="relative mb-12">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="w-full flex-none snap-start bg-luxury-cream border border-luxury-taupe rounded-2xl p-8 hover:bg-luxury-taupe/20 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <StarRating />
                  <p className="text-luxury-mauve leading-relaxed mb-8 italic text-lg md:text-xl text-justify">
                    "{review.review}"
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-luxury-taupe pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-mauve flex items-center justify-center font-bold text-luxury-dark shadow-lg text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-dark text-lg">{review.name}</h4>
                    <p className="text-sm text-luxury-mauve">Google Review</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={() => scrollCarousel('left')}
              className="w-12 h-12 rounded-full border border-luxury-taupe flex items-center justify-center hover:bg-luxury-cream transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="w-12 h-12 rounded-full border border-luxury-taupe flex items-center justify-center hover:bg-luxury-cream transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
