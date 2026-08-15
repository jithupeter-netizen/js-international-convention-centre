"use client";

import { useEffect, useRef, useState } from "react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero Parallax
      gsap.to(".contact-hero-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade up elements
      gsap.fromTo(".fade-up",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-content",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Dummy form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <main id="main-content" ref={containerRef} className="bg-luxury-light min-h-screen flex flex-col overflow-hidden">
      <Header />

      {/* 1. Small Hero Section */}
      <section className="contact-hero relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div 
          className="contact-hero-bg absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/pix/garden.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-cream to-luxury-light/80 to-luxury-dark" />
        
        <div className="relative z-10 text-center px-6 pt-20">
          <h1 className="text-4xl md:text-6xl font-light text-luxury-dark tracking-tight mb-4 drop-shadow-xl">
            Contact Us
          </h1>
          <div className="w-16 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* 2. Main Content (Split Layout) */}
      <section className="contact-content py-20 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Contact Details */}
          <div className="fade-up space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-medium text-luxury-dark mb-6 leading-tight">
                We'd Love to <br className="hidden md:block" />
                <span className="text-luxury-gold">Hear From You</span>
              </h2>
              <p className="text-luxury-mauve text-lg leading-relaxed">
                Whether you're ready to book your dream event or just have a few questions, our team is here to assist you every step of the way.
              </p>
            </div>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0 group-hover:bg-luxury-gold/20 transition-colors">
                  <MapPin className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-luxury-dark font-semibold text-lg mb-1">Our Location</h4>
                  <p className="text-luxury-mauve leading-relaxed">
                    J's International Convention Centre<br />
                    Kalluvathukkal, Kollam<br />
                    Kerala, India - 691578
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0 group-hover:bg-luxury-gold/20 transition-colors">
                  <Phone className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-luxury-dark font-semibold text-lg mb-1">Call Us</h4>
                  <p className="text-luxury-mauve leading-relaxed">
                    <a href="tel:9567765059" className="hover:text-luxury-gold transition-colors">+91 95677 65059</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0 group-hover:bg-luxury-gold/20 transition-colors">
                  <Mail className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-luxury-dark font-semibold text-lg mb-1">Email Us</h4>
                  <p className="text-luxury-mauve leading-relaxed">
                    <a href="mailto:js.international.kollam@gmail.com" className="hover:text-luxury-gold transition-colors">js.international.kollam@gmail.com</a>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0 group-hover:bg-luxury-gold/20 transition-colors">
                  <Clock className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-luxury-dark font-semibold text-lg mb-1">Office Hours</h4>
                  <p className="text-luxury-mauve leading-relaxed">
                    Monday - Saturday: 9:00 AM - 6:00 PM<br />
                    Sunday: By Appointment Only
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="fade-up relative">
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-luxury-taupe/5 rounded-3xl transform rotate-2 blur-sm pointer-events-none" />
            <div className="bg-luxury-cream p-8 md:p-12 rounded-3xl border border-luxury-taupe shadow-2xl relative z-10">
              
              <h3 className="text-2xl font-medium text-luxury-dark mb-8">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-luxury-mauve mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    className="w-full bg-white/5 border border-luxury-taupe rounded-xl px-4 py-3 text-luxury-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email & Phone (Row on desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-luxury-mauve mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-white/5 border border-luxury-taupe rounded-xl px-4 py-3 text-luxury-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-luxury-mauve mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required
                      className="w-full bg-white/5 border border-luxury-taupe rounded-xl px-4 py-3 text-luxury-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Date & Guests (Row on desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-luxury-mauve mb-2">Event Date</label>
                    <input 
                      type="date" 
                      id="date" 
                      className="w-full bg-white/5 border border-luxury-taupe rounded-xl px-4 py-3 text-luxury-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-luxury-mauve mb-2">Estimated Guest Count</label>
                    <input 
                      type="number" 
                      id="guests" 
                      min="1"
                      className="w-full bg-white/5 border border-luxury-taupe rounded-xl px-4 py-3 text-luxury-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <label htmlFor="event" className="block text-sm font-medium text-luxury-mauve mb-2">Event Type</label>
                  <select 
                    id="event" 
                    className="w-full bg-white/5 border border-luxury-taupe rounded-xl px-4 py-3 text-luxury-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all appearance-none"
                  >
                    <option value="" className="bg-luxury-cream">Select an event type...</option>
                    <option value="wedding" className="bg-luxury-cream">Wedding / Reception</option>
                    <option value="corporate" className="bg-luxury-cream">Corporate Event / Conference</option>
                    <option value="exhibition" className="bg-luxury-cream">Exhibition</option>
                    <option value="family" className="bg-luxury-cream">Family Gathering / Party</option>
                    <option value="other" className="bg-luxury-cream">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-luxury-mauve mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    required
                    className="w-full bg-white/5 border border-luxury-taupe rounded-xl px-4 py-3 text-luxury-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-dark font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-luxury-dark/30 border-t-luxury-dark rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Success Message */}
                {isSuccess && (
                  <div className="p-4 bg-luxury-gold/10 border border-luxury-mauve/20 rounded-xl text-luxury-gold text-sm text-center animate-in fade-in slide-in-from-bottom-2">
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </div>
                )}

              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Google Maps Embed */}
      <section className="h-[400px] w-full bg-white/5 relative fade-up border-t border-luxury-taupe group overflow-hidden">
        <iframe
          src="https://maps.google.com/maps?q=J's%20International%20Convention%20Centre,%20Kalluvathukkal,%20Kollam&t=&z=16&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full grayscale-[0.8] contrast-[1.1] opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 pointer-events-auto z-0"
        ></iframe>
      </section>

      <Footer />
    </main>
  );
}
